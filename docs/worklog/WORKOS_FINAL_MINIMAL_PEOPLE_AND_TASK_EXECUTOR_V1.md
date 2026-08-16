# Minimal People and task executor V1

Execution now answers who is responsible for a started task.

## Contract

```text
Person  ≠  Provider  ≠  authenticated user
```

Owner adds real people on `/admin/people`. A planned task receives an explicit executor. Start requires provider + ACTIVE executor + dependencies. The executor display label freezes at Start.

Wording: `Executant: <name>`. Not “finalizat de utilizatorul autentificat”.

## Outside this build

HR, Pontaj, payroll, skills, availability, scheduling, capacity, auth. No fake employee seed. No QC / PACKAGING providers invented to make those tasks executable.
