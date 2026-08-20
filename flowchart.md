# Flowchart Alur BlindMaze Arcade

Flowchart ini menjelaskan perjalanan pemain dari menu utama sampai skor tersimpan di leaderboard. Istilah di dalam diagram dibuat mengikuti tampilan game agar mudah dipahami saat presentasi atau penilaian project.

```mermaid
flowchart TD
    A([Buka BlindMaze]) --> B[Menu utama]

    B --> C[Masukkan username]
    B --> D[How to play<br/>Baca aturan permainan]
    B --> E[Lihat leaderboard]
    D --> B
    E --> F[GET /api/highscores]
    F --> G{API bisa diakses?}
    G -- "Ya" --> H[Tampilkan skor dari server]
    G -- "Tidak" --> I[Tampilkan skor cadangan<br/>dari localStorage]
    H --> B
    I --> B

    C --> J{Username sudah diisi?}
    J -- "Belum" --> C
    J -- "Sudah" --> K[Mulai game<br/>Stage 1 · HP 5 · Skor 0]

    subgraph STAGE[Alur setiap stage]
        K --> L[Buat maze acak<br/>Jalur keluar selalu tersedia]
        L --> M[Fase MEMORIZE<br/>Hafalkan maze selama 10 detik]
        M --> N[Fase MOVE TIME<br/>Dinding menghilang · waktu 20 detik]
        N --> O{Aksi pemain}
        O -- "Gerak panah / WASD / touch" --> P{Kotak tujuan?}
        O -- "Pakai hint sekali" --> Q[Tampilkan dinding<br/>selama 1 detik]
        Q --> N
        P -- "Di luar grid" --> N
        P -- "Jalan aman" --> N
        P -- "Dinding" --> R[HP berkurang]
        P -- "Pintu keluar" --> S[Stage clear<br/>Hitung skor berdasarkan stage, waktu, dan HP]
        N --> T{Waktu 20 detik habis?}
        T -- "Belum" --> O
        T -- "Ya" --> R
        R --> U{HP masih ada?}
        U -- "Ya" --> V[Tampilkan peringatan kalah sementara]
        V --> W[Ulangi stage<br/>Buat maze baru] --> L
        U -- "Tidak" --> X[Game over<br/>Tampilkan stage dan skor akhir]
        S --> Y[Naik ke stage berikutnya<br/>HP dan skor dipertahankan]
        Y --> L
    end

    X --> Z{Simpan highscore?}
    Z -- "Tidak" --> B
    Z -- "Ya" --> AA[POST /api/highscores<br/>Kirim username, stage, dan score]
    AA --> AB{API berhasil?}
    AB -- "Ya" --> AC[Skor tersimpan di server]
    AB -- "Tidak" --> AD[Simpan cadangan di localStorage]
    AC --> E
    AD --> E

    classDef menu fill:#0e7490,stroke:#67e8f9,color:#ecfeff
    classDef stage fill:#1e293b,stroke:#94a3b8,color:#f8fafc
    classDef decision fill:#422006,stroke:#fbbf24,color:#fef3c7
    classDef danger fill:#4c0519,stroke:#fda4af,color:#fff1f2
    classDef success fill:#064e3b,stroke:#6ee7b7,color:#ecfdf5
    class B,C,D,E,F,H,I,K menu
    class L,M,N,O,P,Q,S,Y,AA,AC,AD stage
    class J,G,T,U,Z,AB decision
    class R,V,X danger
    class S,Y,AC success
```

## Ringkasan alur

1. Pemain mengisi username dari menu utama.
2. Game membuat maze acak yang tetap memiliki jalur keluar.
3. Pemain menghafalkan maze selama 10 detik.
4. Setelah dinding menghilang, pemain memiliki waktu 20 detik untuk mencari pintu keluar.
5. Menabrak dinding atau kehabisan waktu mengurangi HP dan mengulang stage.
6. Jika HP habis, hasil akhir dapat disimpan ke API atau cadangan localStorage.
7. Berhasil mencapai pintu keluar menaikkan stage dan mempertahankan skor serta HP.
