# EFAKTUR

Download File, kemudian jalankan composer

```
composer install
```

Kemudian kita copy file .env dengan perintah berikut

```
cp .env.example .env
```

Kemudian generate key

```
php artisan key:generate
```

Update file .env yang terdiri dari timezone, database, user dan password.
Kemudian migrate database

```
php artisan migrate
```

Jalankan Seeder untuk membuat user dan master

```
php artisan db:seed
```

Install Shadcn menggunakan npx

```
npx shadcn@latest init
```
