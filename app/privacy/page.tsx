"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { BsArrowLeft, BsShieldLock } from "react-icons/bs";

type Language = "id" | "en";

export default function PrivacyPage() {
  const [lang, setLang] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  // Load language preference from local storage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("fyvian_lang") as Language;
    if (savedLang === "id" || savedLang === "en") {
      setLang(savedLang);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    setLang((prevLang) => {
      const nextLang = prevLang === "id" ? "en" : "id";
      localStorage.setItem("fyvian_lang", nextLang);
      return nextLang;
    });
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slateCustom-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slateCustom-50 text-slateCustom-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-slateCustom-100 px-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16 relative">
          {/* Back Button */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-slateCustom-500 hover:text-brand transition-colors duration-200 z-10"
          >
            <BsArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {lang === "id" ? "Kembali ke Kalkulator" : "Back to Calculator"}
            </span>
            <span className="sm:hidden">
              {lang === "id" ? "Kembali" : "Back"}
            </span>
          </Link>

          {/* Logo & Brand (Centered) */}
          <div className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-none">
            <Image
              src="/qimey.png"
              alt="Qimey Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-slateCustom-900 font-sans">
              Qimey
            </span>
          </div>

          {/* Gooey Language Toggle Switch */}
          <div className="gooey-toggle-container flex-shrink-0 relative z-10">
            <input
              className="gooey-toggle-input"
              type="checkbox"
              checked={lang === "en"}
              onChange={toggleLanguage}
              aria-label="Switch Language"
            />
            <svg
              className="gooey-toggle"
              viewBox="0 0 292 142"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="gooey-toggle-background"
                d="M71 142C31.7878 142 0 110.212 0 71C0 31.7878 31.7878 0 71 0C110.212 0 119 30 146 30C173 30 182 0 221 0C260 0 292 31.7878 292 71C292 110.212 260.212 142 221 142C181.788 142 173 112 146 112C119 112 110.212 142 71 142Z"
              />
              <g filter="url('#goo-lang')">
                <rect
                  className="gooey-toggle-circle-center"
                  x="13"
                  y="42"
                  width="116"
                  height="58"
                  rx="29"
                  fill="#fff"
                />
                <rect
                  className="gooey-toggle-circle left"
                  x="14"
                  y="14"
                  width="114"
                  height="114"
                  rx="58"
                  fill="#fff"
                />
                <rect
                  className="gooey-toggle-circle right"
                  x="164"
                  y="14"
                  width="114"
                  height="114"
                  rx="58"
                  fill="#fff"
                />
              </g>
              <filter id="goo-lang">
                <feGaussianBlur
                  in="SourceGraphic"
                  result="blur"
                  stdDeviation="10"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                  result="goo"
                />
              </filter>
            </svg>
            <span
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs pointer-events-none select-none transition-all duration-300 z-20 ${
                lang === "id" ? "opacity-100 scale-110" : "opacity-40 grayscale"
              }`}
              style={{ left: "24.3%" }}
            >
              🇮🇩
            </span>
            <span
              className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-xs pointer-events-none select-none transition-all duration-300 z-20 ${
                lang === "en" ? "opacity-100 scale-110" : "opacity-40 grayscale"
              }`}
              style={{ left: "75.7%" }}
            >
              🇬🇧
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white border border-slateCustom-100 rounded-3xl p-6 md:p-10 shadow-sm relative overflow-hidden">
          {/* Subtle Decorative Gradient */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-brand-light via-brand to-brand-dark" />

          {/* Page Title & Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand/10 text-brand flex items-center justify-center mb-4">
              <BsShieldLock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slateCustom-900">
              {lang === "id"
                ? "Kebijakan Privasi Qimey"
                : "Qimey Privacy Policy"}
            </h1>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              {lang === "id"
                ? "Terakhir diperbarui: 7 Juli 2026"
                : "Last updated: July 7, 2026"}
            </p>
          </div>

          {/* Policy Content */}
          <div className="space-y-8 text-sm text-slate-750 leading-relaxed font-sans">
            {lang === "id" ? (
              <>
                <p>
                  Selamat datang di <strong>Qimey</strong>.
                </p>
                <p>
                  Qimey menghargai privasi Anda dan berkomitmen untuk melindungi
                  informasi pribadi pengguna. Kebijakan Privasi ini menjelaskan
                  bagaimana Qimey mengumpulkan, menggunakan, menyimpan, dan
                  melindungi informasi saat Anda menggunakan aplikasi.
                </p>

                <div className="space-y-6">
                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      1. Informasi yang Kami Kumpulkan
                    </h2>
                    <p className="mb-2">
                      Saat ini, seluruh perhitungan keuangan dilakukan secara
                      lokal di perangkat Anda.
                    </p>
                    <p className="mb-2">
                      Qimey <strong>tidak</strong> memerlukan pendaftaran akun
                      dan <strong>tidak</strong> mengumpulkan maupun mengirimkan
                      data keuangan Anda ke server kami.
                    </p>
                    <p className="mb-2">
                      Informasi yang Anda masukkan, seperti:
                    </p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Pendapatan</li>
                      <li>Pengeluaran</li>
                      <li>Tabungan</li>
                      <li>Investasi</li>
                      <li>Proyeksi keuangan</li>
                    </ul>
                    <p>
                      akan tetap tersimpan secara lokal di perangkat Anda,
                      kecuali Anda memilih untuk mengekspor laporan.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      2. Penyimpanan Data
                    </h2>
                    <p>
                      Qimey menyimpan data perhitungan secara lokal di perangkat
                      untuk memberikan pengalaman penggunaan yang lebih baik.
                      Kami tidak memiliki akses terhadap data tersebut.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      3. Ekspor Laporan
                    </h2>
                    <p>
                      Saat Anda mengekspor laporan ke format PDF, Excel, atau
                      CSV, file akan dibuat secara lokal di perangkat Anda. Anda
                      bertanggung jawab atas penyimpanan maupun pembagian file
                      yang telah diekspor.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      4. Layanan Pihak Ketiga
                    </h2>
                    <p className="mb-2">
                      Versi saat ini dari Qimey dapat menggunakan pustaka pihak
                      ketiga yang diperlukan agar aplikasi berfungsi dengan
                      baik.
                    </p>
                    <p className="mb-2">
                      Pada versi mendatang, Qimey dapat mengintegrasikan layanan
                      pihak ketiga seperti:
                    </p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Google AdMob</li>
                      <li>Firebase Analytics</li>
                      <li>Firebase Crashlytics</li>
                    </ul>
                    <p>
                      Jika layanan tersebut digunakan, layanan tersebut dapat
                      mengumpulkan informasi tertentu sesuai dengan Kebijakan
                      Privasi masing-masing. Kebijakan Privasi ini akan
                      diperbarui apabila layanan tersebut mulai digunakan.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      5. Iklan
                    </h2>
                    <p>
                      Versi saat ini dari Qimey{" "}
                      <strong>belum menampilkan iklan</strong>. Pada versi
                      mendatang, aplikasi dapat menampilkan iklan melalui Google
                      AdMob atau mitra periklanan lainnya. Apabila fitur
                      tersebut diterapkan, Kebijakan Privasi ini serta informasi{" "}
                      <strong>Data Safety</strong> di Google Play akan
                      diperbarui sesuai dengan ketentuan yang berlaku.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      6. Keamanan Data
                    </h2>
                    <p>
                      Kami berupaya melindungi informasi pengguna. Karena
                      seluruh data keuangan disimpan secara lokal di perangkat
                      Anda, menjaga keamanan perangkat juga menjadi tanggung
                      jawab pengguna.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      7. Privasi Anak
                    </h2>
                    <p>
                      Qimey tidak ditujukan untuk anak-anak di bawah usia yang
                      ditentukan oleh peraturan yang berlaku. Kami tidak secara
                      sengaja mengumpulkan informasi pribadi dari anak-anak.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      8. Perubahan Kebijakan Privasi
                    </h2>
                    <p>
                      Kami dapat memperbarui Kebijakan Privasi ini
                      sewaktu-waktu. Perubahan akan dipublikasikan pada halaman
                      ini beserta tanggal pembaruan terbaru.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      9. Hubungi Kami
                    </h2>
                    <p>
                      Apabila Anda memiliki pertanyaan mengenai Kebijakan
                      Privasi ini, silakan hubungi kami melalui:
                      <br />
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:vhalentinog@gmail.com"
                        className="text-brand hover:underline font-semibold"
                      >
                        vhalentinog@gmail.com
                      </a>
                    </p>
                  </section>
                </div>
              </>
            ) : (
              <>
                <p>
                  Welcome to <strong>Qimey</strong>.
                </p>
                <p>
                  Qimey respects your privacy and is committed to protecting
                  your personal information. This Privacy Policy explains how
                  Qimey collects, uses, stores, and protects your information
                  when you use our application.
                </p>

                <div className="space-y-6">
                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      1. Information We Collect
                    </h2>
                    <p className="mb-2">
                      At this time, Qimey is designed to perform all financial
                      calculations locally on your device.
                    </p>
                    <p className="mb-2">
                      The application does <strong>not</strong> require account
                      registration and does <strong>not</strong> collect or
                      upload your financial information to our servers.
                    </p>
                    <p className="mb-2">Information you enter, such as:</p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Income</li>
                      <li>Expenses</li>
                      <li>Savings</li>
                      <li>Investments</li>
                      <li>Financial projections</li>
                    </ul>
                    <p>
                      remains stored locally on your device unless you choose to
                      export your reports.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      2. Local Data Storage
                    </h2>
                    <p>
                      Qimey stores your calculation data locally on your device
                      to provide a better user experience. We do not have access
                      to this information.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      3. Report Export
                    </h2>
                    <p>
                      When you export reports to PDF, Excel, or CSV, the
                      generated files are created locally on your device. You
                      are responsible for how you store or share exported files.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      4. Third-Party Services
                    </h2>
                    <p className="mb-2">
                      The current version of Qimey may use third-party libraries
                      necessary for application functionality.
                    </p>
                    <p className="mb-2">
                      Future versions of Qimey may integrate third-party
                      services such as:
                    </p>
                    <ul className="list-disc pl-5 mb-2 space-y-1">
                      <li>Google AdMob</li>
                      <li>Firebase Analytics</li>
                      <li>Firebase Crashlytics</li>
                    </ul>
                    <p>
                      If these services are enabled, they may collect certain
                      device information in accordance with their own Privacy
                      Policies. This Privacy Policy will be updated whenever
                      such services are introduced.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      5. Advertising
                    </h2>
                    <p>
                      The current version of Qimey does <strong>not</strong>{" "}
                      display advertisements. Future versions may include
                      advertisements provided by Google AdMob or other
                      advertising partners. If advertisements are introduced,
                      this Privacy Policy and the Google Play Data Safety
                      section will be updated accordingly.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      6. Data Security
                    </h2>
                    <p>
                      We take reasonable measures to protect your information.
                      Because your financial data is stored locally on your
                      device, protecting access to your device is also your
                      responsibility.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      7. Children's Privacy
                    </h2>
                    <p>
                      Qimey is not directed toward children under the age
                      required by applicable law. We do not knowingly collect
                      personal information from children.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      8. Changes to This Privacy Policy
                    </h2>
                    <p>
                      We may update this Privacy Policy from time to time. Any
                      updates will be published on this page with a revised
                      "Last Updated" date.
                    </p>
                  </section>

                  <section className="border-l-2 border-brand/20 pl-4">
                    <h2 className="text-base font-bold text-slateCustom-900 mb-2">
                      9. Contact Us
                    </h2>
                    <p>
                      If you have any questions regarding this Privacy Policy,
                      please contact us:
                      <br />
                      <strong>Email:</strong>{" "}
                      <a
                        href="mailto:vhalentinog@gmail.com"
                        className="text-brand hover:underline font-semibold"
                      >
                        vhalentinog@gmail.com
                      </a>
                    </p>
                  </section>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slateCustom-100 bg-white/60 backdrop-blur-sm mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slateCustom-400 text-center">
            © {new Date().getFullYear()} Qimey. All rights reserved.
          </p>
          <a
            href="https://github.com/VhalennnG/qimey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slateCustom-200 bg-white text-slateCustom-700 text-xs font-medium hover:bg-slateCustom-50 hover:border-slateCustom-300 transition-all duration-200 shadow-sm"
          >
            View on GitHub
          </a>
        </div>
      </footer>
    </main>
  );
}
