#!/bin/bash
cd /var/www/mbpp-uploads

UUIDS=(
  d94c46c0-e995-4978-b8a4-f72626bdd71a
  5e3e3a50-96aa-4ea1-b12f-4292b5334a69
  748f11c6-4a3a-40df-a72c-7996294ab548
  aaf94548-8050-450f-854e-2ae03723e223
  65d22ee3-178b-4776-ac76-bddeedc375b6
  2a77ab83-eeea-408f-9f62-1aa87e10c0b0
  273c140a-9aa2-4c0e-ad42-2e28e923f166
  34f19858-419b-4f54-b311-283b931c4dd6
  14a6d187-db86-46e7-8ac4-882897bb3c2f
  1334c022-9b69-4b2b-bee9-184700d587f0
  bb3d9443-14df-4258-b5db-3949c2df4a42
)

RAILWAY_URL="https://propease-production.up.railway.app"

for uuid in "${UUIDS[@]}"; do
  curl -sL -o "${uuid}.png" "${RAILWAY_URL}/api/upload/file/${uuid}"
  if [ -f "${uuid}.png" ] && [ -s "${uuid}.png" ]; then
    echo "OK: ${uuid}.png ($(du -h ${uuid}.png | cut -f1))"
  else
    echo "FAIL: ${uuid}"
  fi
done

chown mbpp:mbpp /var/www/mbpp-uploads/*
chmod 644 /var/www/mbpp-uploads/*
echo "Done"
ls -lh /var/www/mbpp-uploads/
