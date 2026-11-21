# Laboratorio: escaneo de secretos y dependencias

Proyecto Node.js para practicar escaneo de secretos y dependencias con Gitleaks
y OWASP Dependency-Check. `.env.example` contiene una conexión PostgreSQL
ficticia para que Gitleaks la detecte. La aplicación obtiene `DATABASE_URL` del
entorno y nunca imprime su valor.

> La conexión de ejemplo usa credenciales falsas y apunta a `localhost`. No la
> uses fuera del laboratorio. `lodash` está actualizado a una versión corregida.

Para el workflow, crea un secreto de repositorio llamado `DATABASE_URL` en
GitHub: **Settings → Secrets and variables → Actions**. Ese secreto real se
inyecta solo en la aplicación; no se guarda en el repositorio.

## Requisitos

- Node.js y npm
- Docker Desktop en Windows, con Docker en ejecución

## Ejecutar el ejemplo

```powershell
npm install
npm start
```

## Escaneos locales (PowerShell)

Desde la raíz del proyecto:

```powershell
New-Item -ItemType Directory -Force reports | Out-Null

docker run --rm -v "${PWD}:/repo" zricethezav/gitleaks:latest `
  dir /repo --report-format json --report-path /repo/reports/gitleaks.json

docker run --rm -v "${PWD}:/src" -v "${PWD}\reports:/report" `
  owasp/dependency-check:latest `
  --scan /src --format HTML --out /report --failOnCVSS 7
```

El informe de Gitleaks queda en
`reports/gitleaks.json` y el de Dependency-Check en
`reports/dependency-check-report.html`. La primera ejecución de
Dependency-Check puede tardar mientras descarga su base de vulnerabilidades.

El archivo `.env` está excluido por `.gitignore`. El archivo versionado
`.env.example` permite que Gitleaks detecte el valor ficticio en el pipeline.
GitHub Actions pasa el secreto real `DATABASE_URL` a la aplicación como
variable de entorno; el programa solo informa si está configurado, nunca revela
su contenido.

## Pipeline

El workflow [security-scans.yml](.github/workflows/security-scans.yml) ejecuta
los escáneres en trabajos separados para que uno corra aunque el otro falle.
Sube los informes como artefactos y marca el pipeline como fallido al detectar
hallazgos. Gitleaks debe marcar el ejemplo ficticio de `.env.example`, y
Dependency-Check debe pasar con la dependencia corregida.

## Limpiar el laboratorio

Para eliminar la demostración, borra el secreto `DATABASE_URL` de la
configuración de Actions si ya no lo necesitas.
