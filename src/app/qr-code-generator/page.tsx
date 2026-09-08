"use client";

import { FormEvent, useEffect, useState } from "react";

import {
  createQrCode,
  getQrCodes,
} from "../../services/qrCodeService";

import { IQrCode } from "../../types/qrCode";

export default function QrCodeGeneratorPage() {
  const [url, setUrl] = useState("");
  const [qrCode, setQrCode] = useState<IQrCode | null>(null);
  const [qrCodes, setQrCodes] = useState<IQrCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadQrCodes();
  }, []);

  async function loadQrCodes() {
    try {
      const data = await getQrCodes();
      setQrCodes(data);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    setError("");
    setQrCode(null);

    if (!url.trim()) {
      setError("لطفاً یک آدرس وارد کنید.");
      return;
    }

    try {
      setLoading(true);

      const result = await createQrCode({
        url: url.trim(),
      });

      setQrCode(result);

      setQrCodes((previous) => [
        result,
        ...previous,
      ]);

      setUrl("");
    } catch (error) {
      console.error(error);
      setError("ساخت QR Code با خطا مواجه شد.");
    } finally {
      setLoading(false);
    }
  }

  function downloadQrCode(qrCode: IQrCode) {
    if (!qrCode) return;

    const link = document.createElement("a");

    link.href = qrCode.qrCode;
    link.download = `qrcode-${qrCode.id}.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-2xl">

        <h1 className="mb-8 text-center text-3xl font-bold">
          ایجاد QR Code
        </h1>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl bg-white p-6 shadow"
        >
          <label className="mb-2 block font-medium">
            لینک مورد نظر
          </label>

          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full rounded-xl border p-3 outline-none"
          />

          {error && (
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 w-full rounded-xl bg-blue-600 p-3 font-medium text-white disabled:opacity-50"
          >
            {loading ? "در حال ساخت..." : "ساخت QR Code"}
          </button>
        </form>

        {qrCode && (
          <div className="mt-6 rounded-2xl bg-white p-6 text-center shadow">
            <h2 className="mb-4 text-xl font-bold">
              QR Code شما
            </h2>

            <img
              src={qrCode.qrCode}
              alt="QR Code"
              className="mx-auto w-64"
            />

            <p className="mt-4 break-all text-sm text-gray-600">
              {qrCode.url}
            </p>

            <button
              onClick={() => downloadQrCode(qrCode)}
              className="m-2 rounded-xl bg-green-600 px-6 py-3 font-medium text-white"
            >
              دانلود PNG
            </button>
          </div>
        )}

        {qrCodes.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold">
              QR Code های قبلی
            </h2>

            <div className="space-y-4">
              {qrCodes.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow"
                >
                  <img
                    src={item.qrCode}
                    alt="QR Code"
                    className="h-20 w-20"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="break-all text-sm">
                      {item.url}
                    </p>
                  </div>

                  <button
                    onClick={() => downloadQrCode(item)}
                    className="mt-4 rounded-xl bg-green-600 px-6 py-3 font-medium text-white cursor-pointer"
                  >
                    دانلود PNG
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}