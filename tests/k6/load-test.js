import http from 'k6/http';
import { check, sleep, group } from 'k6';

// 1. Konfigurasi Pengujian (Options)
// Anda dapat memilih tipe pengujian dengan menjalankan:
// k6 run -e TEST_TYPE=load tests/k6/load-test.js
const testType = __ENV.TEST_TYPE || 'smoke';

let stages = [];

if (testType === 'smoke') {
    // Smoke Test: Menguji sistem dengan beban minimal untuk memverifikasi semuanya bekerja
    stages = [
        { duration: '10s', target: 1 },
    ];
} else if (testType === 'load') {
    // Load Test: Beban normal untuk menguji respons aplikasi
    stages = [
        { duration: '1m', target: 20 },  // Ramp-up ke 20 pengguna
        { duration: '3m', target: 20 },  // Bertahan di 20 pengguna
        { duration: '1m', target: 0 },   // Ramp-down ke 0 pengguna
    ];
} else if (testType === 'stress') {
    // Stress Test: Menguji batas maksimal sistem (breaking point)
    stages = [
        { duration: '1m', target: 10 },
        { duration: '2m', target: 50 },  // Ramp-up cepat ke 50 pengguna
        { duration: '3m', target: 100 }, // Naik lagi ke 100 pengguna
        { duration: '2m', target: 100 }, // Tahan pada beban puncak
        { duration: '1m', target: 0 },   // Ramp-down
    ];
} else if (testType === 'soak') {
    // Soak/Endurance Test: Menguji performa dalam durasi lama (mencari memory leaks)
    stages = [
        { duration: '2m', target: 15 },
        { duration: '30m', target: 15 }, // Tahan beban konstan selama 30 menit
        { duration: '2m', target: 0 },
    ];
}

export const options = {
    stages: stages,
    thresholds: {
        // Toleransi tingkat kegagalan request harus di bawah 1%
        http_req_failed: ['rate<0.01'],
        // 95% request durasinya harus di bawah 500ms
        http_req_duration: ['p(95)<500'],
    },
};

// Base URL target pengujian (default: localhost Laravel)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8000';

// Helper untuk menghasilkan NIK acak sepanjang 16 karakter angka
function generateRandomNIK() {
    let nik = '';
    for (let i = 0; i < 16; i++) {
        nik += Math.floor(Math.random() * 10).toString();
    }
    return nik;
}

// 2. Alur Pengujian Utama (Default Function)
export default function () {
    // Group 1: Halaman Publik Utama
    group('Public Pages Access', function () {
        const resHome = http.get(`${BASE_URL}/`);
        check(resHome, {
            'home status is 200 or 302': (r) => r.status === 200 || r.status === 302,
        });
        sleep(1);

        const resPortal = http.get(`${BASE_URL}/registration-portal`);
        check(resPortal, {
            'registration portal status is 200': (r) => r.status === 200,
            'contains registration text': (r) => r.body && r.body.indexOf('registration') !== -1,
        });
        sleep(1);
    });

    // Group 2: Alur Cek NIK
    group('NIK Verification API', function () {
        const randomNIK = generateRandomNIK();
        const resCheckNik = http.get(`${BASE_URL}/registration-portal/check-nik?nik=${randomNIK}`, {
            headers: {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        check(resCheckNik, {
            'check-nik status is 200': (r) => r.status === 200,
            'check-nik returns json exists flag': (r) => {
                try {
                    const json = r.body ? JSON.parse(r.body) : null;
                    return json && json.hasOwnProperty('exists');
                } catch (e) {
                    return false;
                }
            }
        });
        sleep(1.5);
    });

    // Group 3: Halaman Selektor Pendaftaran
    group('Registration Selectors', function () {
        const resSelector = http.get(`${BASE_URL}/registration-portal/individual-registration/nik-registration-selector`);
        check(resSelector, {
            'nik-registration-selector status is 200': (r) => r.status === 200,
        });
        sleep(1);
    });
}

/*
// =============================================================================
// CATATAN DAN TEMPLATE UNTUK ENDPOINT TERPROTEKSI (AUTH)
// =============================================================================
// Jika Anda ingin menguji endpoint berotentikasi, Anda harus mengambil cookie
// session dan token CSRF dari aplikasi Laravel Anda. Berikut contoh implementasinya:

export function testAuthenticatedFlow() {
    // 1. Ambil halaman login untuk mendapatkan cookie XSRF-TOKEN
    const loginPageRes = http.get(`${BASE_URL}/login`);
    
    // 2. Lakukan POST login dengan user uji
    const loginPayload = JSON.stringify({
        email: 'testuser@example.com',
        password: 'password_anda',
    });
    
    const loginParams = {
        headers: {
            'Content-Type': 'application/json',
            // Laravel memerlukan header X-XSRF-TOKEN untuk request Inertia/AJAX
        },
    };
    
    const loginPostRes = http.post(`${BASE_URL}/login`, loginPayload, loginParams);
    
    // 3. Gunakan cookie dari respon login untuk mengakses halaman terproteksi
    const dashboardRes = http.get(`${BASE_URL}/dashboard`);
    check(dashboardRes, {
        'dashboard status is 200': (r) => r.status === 200,
    });
}
*/
