# Christ Embassy Mozambique Dashboard

First dashboard prototype for the church team portal.

## Included in v1 prototype

- Login screen placeholder
- Dashboard home
- Members
- Departments
- Cell groups
- Counseling / first timers
- Escola de Fundação tracking
- Users and roles

## Counseling workflow

The first timer form includes:

- Nome
- Número de telefone
- Data de nascimento
- Bairro
- Profissão
- Quem convidou
- Nasceu de novo?
- Quer fazer Escola de Fundação?
- Quer fazer parte de uma célula?
- Vai participar no próximo culto?
- Notas de acompanhamento

If a first timer chooses Escola de Fundação, they are automatically enrolled in the Foundation School tracker.

## Foundation School workflow

- 7 classes
- Exam score
- Graduation status

## Current technical note

This prototype stores data in browser localStorage only. The production version should connect to Supabase for authentication, database, roles and backups.
