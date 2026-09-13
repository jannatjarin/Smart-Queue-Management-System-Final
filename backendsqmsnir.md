# Backend Smart Queue Management System (NestJS)

Ei file e backend er structure and sob folder/file ki kaj kore ta sohoj bhabe bujhano holo.

## Root Files

- **`main.ts`**: Eta hocche application er entry point. Ekhane app start hoy. 
  ```typescript
  import { NestFactory } from '@nestjs/core';
  import { AppModule } from './app.module';

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000); // 3000 port e server start kore
  }
  bootstrap();
  ```
- **`app.module.ts`**: Eta hocche root module. Ekhane baki shob module (auth, users, etc.) eksathe connect kora hoy.
- **`app.controller.ts` & `app.service.ts`**: Ekhane simple base routes thake (jemon `GET /` e "Hello World" return kora).

## Folders in `src` (Modules)

Backend ta mainly onek gulo choto choto 'Module' e bhag kora. Protita module e sadharonoto 3 ti mukhho (main) file thake:
1. **Controller (`.controller.ts`)**: Client (Frontend ba Mobile app) theke asa request receive kore.
2. **Service (`.service.ts`)**: Asol business logic ekhane thake (Database e data save kora, read kora).
3. **Module (`.module.ts`)**: Controller and Service ke bind kore or eksathe jukto kore.

Niche folder gulor details dewa holo:

### 1. `auth` (Authentication)
Ekhane user login, register, password reset, and JWT (JSON Web Token) er kaj gulo hoy. User jeno safely login korte pare tar jonno ei folder.

### 2. `users`
System er joto user (admin, staff, customer) ache tader data database theke tola, notun user toiri kora, ba update korar logic ekhane thake.

### 3. `queues`
Etai system er main ongsho! Queue ba line toiri kora, kon queue te koto jon ache, queue er status ki, ei shob kaj `queues` folder er bhitor hoy. 

### 4. `tickets`
Jokhon keu queue te daray, tokon tar jonno ekta ticket generate korte hoy. Ticket er number koto hobe, ticket ta kon user er, eigula ei folder handle kore.

### 5. `counters`
Smart queue te multiple counter ba desk thakte pare. Kon counter e kon staff bosheche, counter faka naki busy, tar shob logic ekhane thake.

### 6. `services`
Ki ki dhoroner service system dicche (jemon: Bank e cash deposit, check clear). Ei service gulor list and data manage kora hoy ekhane.

### 7. `notifications`
User der ke real-time alert ba notification (e.g. "Apnar serial chole asche!") pathanor kaj ta ekhane kora hoy.

### 8. `mail`
System theke email (jemon registration confirmation ba password reset email) pathanor logic ekhane thake. Eta sadharonoto SMTP server (jemon Mailtrap) use kore kaj kore.

### 9. `common`
Ekhane kono specific feature er kaj hoy na, borong shob feature er majhe common je utility ba helpers lage segula thake. Jemon, custom decorators, guards (ke kon route access korte parbe, etc).

### 10. `config`
Environment variables (`.env` file theke Database connection string, JWT secrets, etc.) pore application e provide korar kaj ta ekhane hoy.

---
**Summary:** Ei holo backend er basic structure! Protita module ekta nirdishto kaj kore, jate code clean and maintainable thake. Frontend theke ekta request asle Controller ta receive kore, tarpor Service theke seitar kaj shomponno kore Frontend ke result pass kore.
