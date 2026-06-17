#!/bin/bash
PG_HBA=/etc/postgresql/16/main/pg_hba.conf
sed -i 's/^local.*all.*all.*peer/local   all   all   md5/' $PG_HBA
sed -i 's/scram-sha-256/md5/g' $PG_HBA
systemctl restart postgresql
echo "PostgreSQL auth fixed"
