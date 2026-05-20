# 🚀 Enterprise Marketplace - Infraestructura con SQLite

Este entorno ejecuta la mensajería y observabilidad en Docker, mientras que los datos se guardan de forma ligera en archivos locales SQLite.

## 🛠️ Requisitos Previos
* [Docker Desktop](https://docker.com) instalado y ejecutándose.

## 🚀 Instrucciones de Arranque

1. **Encender los servicios de soporte (RabbitMQ, Redis, Seq):**
   ```bash
   docker-compose up -d
   ```

2. **Verificar contenedores activos:**
   ```bash
   docker ps
   ```

## 🗺️ Herramientas Disponibles en el Navegador


| Servicio | Tecnología | Puerto Local | Acceso Web / Conexión | Credenciales |
| :--- | :--- | :--- | :--- | :--- |
| **Broker de Eventos** | RabbitMQ | `15672` | [http://localhost:15672](http://localhost:15672) | `guest` / `guest` |
| **Logs Centralizados**| Seq | `8081` | [http://localhost:8081](http://localhost:8081) | Sin contraseña |
| **Caché / BFF** | Redis | `6379` | `localhost:6379` | Sin contraseña |

## 📁 Archivos de Base de Datos
Cada microservicio generará automáticamente un archivo `.db` en su respectiva carpeta cuando lo arranques por primera vez. No necesitas instalar ningún motor de base de datos en tu máquina.
