# Laboratorio: escaneo de secretos y dependencias

Proyecto Node.js para practicar escaneo de secretos y dependencias con Gitleaks
y OWASP Dependency-Check. La aplicación obtiene `DATABASE_URL` del entorno y
nunca imprime su valor. `.env.example` solo documenta el nombre de la variable;
no contiene una conexión ni credenciales.

Para el workflow, crea un secreto de repositorio llamado `DATABASE_URL` en
GitHub: **Settings → Secrets and variables → Actions**. Ese secreto se inyecta
solo en la aplicación; no se guarda en el repositorio.

Dependency-Check también requiere una clave API de NVD. Solicítala en
<https://nvd.nist.gov/developers/request-an-api-key> y guárdala, en la misma
sección de GitHub, con el nombre `NVD_API_KEY`.

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
  --scan /src --format HTML --out /report --failOnCVSS 7 `
  --nvdApiKey "$env:NVD_API_KEY"
```

Define `NVD_API_KEY` en la sesión de PowerShell antes de ejecutar ese comando.

El informe de Gitleaks queda en
`reports/gitleaks.json` y el de Dependency-Check en
`reports/dependency-check-report.html`. La primera ejecución de
Dependency-Check puede tardar mientras descarga su base de vulnerabilidades.

## Pipeline

El workflow [security-scans.yml](.github/workflows/security-scans.yml) ejecuta
los escáneres en trabajos separados para que uno corra aunque el otro falle.
Sube los informes como artefactos y marca el pipeline como fallido al detectar
hallazgos. Con el valor real solo en GitHub y la dependencia corregida, ambos
análisis deberían pasar si no hay otros hallazgos.