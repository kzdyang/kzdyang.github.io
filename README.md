# KY Project — Website Studio & Produk

Website statis ringan bergaya *Dark Editorial Precision* untuk menampilkan **KY Project**, produk unggulan **DompetRumah**, eksplorasi proyek berikutnya, dan kanal komunitas (**Threads**, **Instagram**, **GitHub**, **Email**).

## Pratinjau Lokal
Jalankan server bawaan (Node.js):

```powershell
node tools/serve.js
```

Lalu buka `http://127.0.0.1:5510/`.

## Mengisi Link Akun Threads & Instagram Anda
Buka `js/motion.js` dan ubah objek `KY_LINKS` di bagian paling atas:

```js
var KY_LINKS = {
  github: 'https://github.com/kzdyang',
  privacyPolicy: 'https://kzdyang.github.io/dompetrumah-privacy/',
  email: '7kzd.yang@gmail.com',
  threadsProfile: 'https://www.threads.net/@USERNAME_ANDA',
  instagramProfile: 'https://www.instagram.com/USERNAME_ANDA/',
  ...
};
```

## Deploy Gratis ke GitHub Pages (`https://kzdyang.github.io/`)
1. Buat repository publik baru di GitHub bernama **`kzdyang.github.io`**.
2. Unggah seluruh isi folder `ky-project` (`index.html`, `dompetrumah/`, `css/`, `js/`, `assets/`).
3. Buka **Settings → Pages → Build and deployment** → `Deploy from a branch` (`main` / `/root`).
4. Biarkan repository `dompetrumah-privacy` tetap aktif agar URL Privacy Policy Play Console yang sudah terdaftar tidak pernah putus.
