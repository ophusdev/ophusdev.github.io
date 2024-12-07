const n="postgres-race-condition-and-unique-constraint.md",e="post",o="postgres-race-condition-and-unique-constraint",i=`
Mi sono trovato davanti ad un problema di race condition su Postgres in un processo che doveva importare migliaia di record in parallelo con il risultato che sul database mi ritrovavo con decine di record duplicati.

Le tecnologie coinvolte sono Python3.11, SQLAlchemy 2.0.36 e Postgres 17.2 ma in questo post ricreeremo la situazione con TSQL e un paio di terminali per non avere troppe dipendenze esterne.

Alla fine del post si può trovare il paragrafo con la query tradotta nella sintassi di SQLAlchemy.

## Iniziamo

Avviamo un postgres usando Docker con un semplice \`docker compose up -d\`

\`\`\`yaml
services:
  postgres:
    image: postgres:17.2
    ports:
      - 5432:5432
    environment:
      - POSTGRES_DB=people
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=dev
\`\`\`

e connettiamoci con una shell

\`\`\`bash
psql postgresql://user:dev@localhost/people
\`\`\`

Creiamo la tabella per il nostro esperimento

\`\`\`sql
CREATE TABLE people (
    id SERIAL NOT NULL,
    fiscal_code VARCHAR(16) NOT NULL,
    first_name VARCHAR(255) NOT NULL
);
\`\`\`

Inseriamo un paio di dati

\`\`\`sql
BEGIN;
INSERT INTO people (fiscal_code, first_name) VALUES ('AAA', 'Pippo');
INSERT INTO people (fiscal_code, first_name) VALUES ('BBB', 'Pluto');
COMMIT;
\`\`\`

Controlliamo la nostra tabella

\`\`\`sql
SELECT * FROM people;

id | fiscal_code | first_name
----+-------------+------------
  1 | AAA         | Pippo
  2 | BBB         | Pluto
(2 rows)
\`\`\`

## La nostra query

Adesso usiamo il costrutto INSERT INTO SELECT per inserire un nuovo record senza dover fare prima una query per testare l'esistenza del record e otteniamo che nessuna riga viene inserita poichè esiste già un record identico

\`\`\`sql
INSERT INTO people (fiscal_code, first_name)
SELECT
'AAA',
'Pippo'
WHERE NOT EXISTS (
        SELECT fiscal_code, first_name
            FROM people
            WHERE people.fiscal_code = 'AAA'
            AND people.first_name = 'Pippo'
        )
RETURNING people.id, people.fiscal_code, people.first_name;
\`\`\`

Infatti la risposta che otteniamo dopo l'insert è

\`\`\`sql
id | fiscal_code | first_name
----+-------------+------------
(0 rows)

INSERT 0 0
\`\`\`

Puliamo la nostra tabella

\`\`\`sql
DELETE FROM people;
\`\`\`

## Simuliamo una scrittura concorrenziale

Apriamo due nuove shell sul terminale e connettiamoci al database

Per simulare la concorrenza usiamo questo trucco:

| **Step** |                  **Shell di sinistra**                   |                   **Shell di destra**                    |
| :------: | :------------------------------------------------------: | :------------------------------------------------------: |
|    1     |                    digitiamo \`BEGIN;\`                    |                                                          |
|    2     |                                                          |                    digitiamo \`BEGIN;\`                    |
|    3     | [Copiamo ed eseguiamo la nostra query](#la-nostra-query) |                                                          |
|    4     |                                                          | [Copiamo ed eseguiamo la nostra query](#la-nostra-query) |
|    5     |                    digitiamo \`COMMIT\`                    |                                                          |
|    6     |                                                          |                    digitiamo \`COMMIT\`                    |

Eseguiamo lo step 1 nella shell di sinistra e lo step 2 nella shell di destra

Ora eseguiamo lo step 3 nella shell di sinistra e riceveremo sul terminale la risposta \`INSERT 0 1\` ma la transazione non è ancora commitata quindi sul database noi non abbiamo ancora scritto nessun record.

Ora eseguiamo lo step 4 e dato che è postgres a preoccuparsi del lock sul record ed essendo la insert una operazione che esegue il lock prima di effettuare cambiamenti ci aspettiamo che la shell rimanga in attesa che l'altra transazione si chiuda ... e invece eseguendo la query anche la seconda shell ci restituisce \`INSERT 0 1\`

Eseguiamo gli step 5 e 6 per concludere le due transazioni

La [nostra query](#la-nostra-query) con il suo where non è bloccante quindi ci porta ad un problema di race condition da cui non siamo protetti nel caso di concorrenzialità e ci troviamo con i record duplicati

\`\`\`sql
SELECT * FROM people;

id | fiscal_code | first_name
----+-------------+------------
  3 | AAA         | Pippo
  4 | AAA         | Pippo
(2 rows)

\`\`\`

## La soluzione

Ci viene in aiuto un paragrafo della documentazione di [Postgres](https://www.postgresql.org/docs/current/sql-insert.html) che riporta

> INSERT into tables that lack unique indexes will not be blocked by concurrent activity. Tables with unique indexes might block if concurrent sessions perform actions that lock or modify rows matching the unique index values being inserted; the details are covered in Section 62.5. ON CONFLICT can be used to specify an alternative action to raising a unique constraint or exclusion constraint violation error. (See ON CONFLICT Clause below.)

Dobbiamo creare un indice univoco per fare in modo che Postgres ci permetta di proteggerci da scritture concorrenti

Puliamo di nuovo la tabella con

\`\`\`sql
DELETE FROM people;
\`\`\`

e creiamo l'indice

\`\`\`sql
ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name UNIQUE (fiscal_code, first_name);
\`\`\`

Adesso, ripetendo i passaggi del paragrafo [Simuliamo una scrittura concorrenziale](#simuliamo-una-scrittura-concorrenziale) e otteniamo che nella seconda shell rimarremo in attesa finche dalla prima non effettueremo un rollback
o una commit;

Tutto perfetto ma nella seconda shell otteniamo un messaggio di errore

> ERROR: duplicate key value violates unique constraint "uq_people_fiscal_code_first_name"
> DETAIL: Key (fiscal_code, first_name)=(AAA, Pippo) already exists.

Prima puliamo la tabella

\`\`\`sql
DELETE from people;
\`\`\`

Serve una piccola modifica alla nostra query aggiungendo la clausola \`ON CONFLICT DO NOTHING\` e possiamo riprodurre di nuovo i passaggi del paragrafo [Simuliamo una scrittura concorrenziale](#simuliamo-una-scrittura-concorrenziale)

\`\`\`sql
INSERT INTO people (fiscal_code, first_name)
SELECT
'AAA',
'Pippo'
WHERE NOT EXISTS (
        SELECT fiscal_code, first_name
            FROM people
            WHERE people.fiscal_code = 'AAA'
            AND people.first_name = 'Pippo'
        )
ON CONFLICT DO NOTHING
RETURNING people.id, people.fiscal_code, people.first_name;
\`\`\`

Controlliamo il nostro risultato

\`\`\`sql
SELECT * from people;

 id | fiscal_code | first_name
----+-------------+------------
  7 | AAA         | Pippo
(1 row)
\`\`\`

## Scenario Bonus

E se avessimo uno dei campi della tabella che fosse nullable?

Facciamo una prova

\`\`\`sql
DROP TABLE people;

CREATE TABLE people (
    id SERIAL NOT null,
    fiscal_code VARCHAR(16) NOT null,
    first_name VARCHAR(255) NOT null,
    birth_date timestamptz NULL
);

ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name_birth_date UNIQUE (fiscal_code, first_name, birth_date);

\`\`\`

Inseriamo due righe

\`\`\`sql
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
\`\`\`

\`\`\`sql
SELECT * FROM people;

id | fiscal_code | first_name | birth_date
----+-------------+------------+------------
  1 | AAA         | Pippo      |
  2 | AAA         | Pippo      |
(2 rows)
\`\`\`

Il nostro unique constraint non si è attivato.

Questo perchè da Postgres 15 è necessario usare la clausola \`NULLS NOT DISTINCT\` che permette a Postgres di evitare di trattare i null come chiavi distinte.

Applichiamo le modifiche

\`\`\`sql
DELETE FROM people;

ALTER TABLE people DROP CONSTRAINT uq_people_fiscal_code_first_name_birth_date;

ALTER TABLE ONLY people ADD CONSTRAINT uq_people_fiscal_code_first_name_birth_date UNIQUE NULLS NOT DISTINCT (fiscal_code, first_name, birth_date);
\`\`\`

E questa volta un solo record viene inserito mentre il secondo darà errore

\`\`\`sql
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
INSERT INTO people (fiscal_code, first_name, birth_date) VALUES ('AAA', 'Pippo', NULL);
\`\`\`

## SQLAlchemy Query

\`\`\`bash
virtualenv .venv
. .venv/bin/activate

pip install sqlalchemy==2.0.36
pip install psycopg2-binary==2.9.10
\`\`\`

\`\`\`python
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql.schema import MetaData
from sqlalchemy import UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql.sqltypes import String

session_provider = create_engine(
    "postgresql://user:dev@localhost/people",
    future=True
)

metadata_obj = MetaData()


class Base(DeclarativeBase):
    metadata = metadata_obj


class Person(Base):
    __tablename__ = "people"
    __table_args__ = (UniqueConstraint("fiscal_code", "first_name", name="uq_people_fiscal_code_first_name"),)

    id: Mapped[int] = mapped_column(primary_key=True)

    fiscal_code: Mapped[str] = mapped_column(String(16))
    first_name: Mapped[str] = mapped_column(String(255))


with session_provider.begin() as db_session:
    record = (
        insert(Person)
        .values(
            fiscal_code='AAA',
            first_name='Pippo',
        )
        .on_conflict_do_nothing(index_elements=["fiscal_code", "first_name"])
        .returning(Person)
    )

    print(db_session.execute(record).scalar_one_or_none())
\`\`\`
`,a={title:"Postgres: Race Condition, Unique Constraints and Handling Concurrency",description:"Come gestire le ace conditions e gli unique constraints in Postgres, utilizzando ON CONFLICT DO NOTHING per prevenire record duplicati",publishDate:new Date(1733526e6),updatedDate:new Date(1733526e6),draft:!1,tags:["postgres","python","race condition"]},t={type:"content",filePath:"/media/io/Dati/linux/ophusdev-blog/src/content/post/postgres-race-condition-and-unique-constraint.md",rawData:`
title: "Postgres: Race Condition, Unique Constraints and Handling Concurrency"
description: "Come gestire le ace conditions e gli unique constraints in Postgres, utilizzando ON CONFLICT DO NOTHING per prevenire record duplicati"
publishDate: "07 Dec 2024"
updatedDate: 07 Dec 2024
tags: [postgres, python, race condition]`};export{t as _internal,i as body,e as collection,a as data,n as id,o as slug};
