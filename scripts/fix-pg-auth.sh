#!/bin/bash
PG_HBA=/etc/postgresql/16/main/pg_hba.conf
sed -i 's/^local.*all.*all.*peer/local   all   all   scram-sha-256/' $PG_HBA
sed -i 's/\bmd5\b/scram-sha-256/g' $PG_HBA
su - postgres -c "psql -c \"ALTER USER mbpp_user WITH PASSWORD 'Mbpp2026!Secure';\""
systemctl reload postgresql
echo "PostgreSQL auth upgraded to SCRAM-SHA-256"
