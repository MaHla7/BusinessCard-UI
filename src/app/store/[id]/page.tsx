"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
} from "next/navigation";

import {
  Phone,
  Mail,
  ExternalLink,
  Download,
} from "lucide-react";

import {
  getBusinessCard,
} from "../../../services/businessCardService";

import {
  BusinessCard,
} from "../../../types/businessCard";

import instagram from "../../icons/instagram.png"
import facebook from "../../icons/facebook.png"
import linkdin from "../../icons/linkedin.png"
import telegram from "../../icons/telegram.png"
import website from "../../icons/website.png"
import whatsapp from "../../icons/whatsapp.png"
import youtube from "../../icons/youtube.png"
import XIcon from "../../icons/x.png"

function LinkIcon({
  type,
}: {
  type?: string;
}) {
  switch (type) {
    case "Instagram":
      return (
        <img
          src={instagram.src}
          alt="Instagram"
          className="h-7 w-7"
        />
      );

    case "Telegram":
      return (
        <img
          src={telegram.src}
          alt="Telegram"
          className="h-7 w-7"
        />
      );

    case "WhatsApp":
      return (
        <img
          src={whatsapp.src}
          alt="WhatsApp"
          className="h-7 w-7"
        />
      );

    case "Website":
      return (
        <img
          src={website.src}
          alt="Website"
          className="h-7 w-7"
        />
      );

    case "LinkedIn":
      return (
        <img
          src={linkdin.src}
          alt="LinkedIn"
          className="h-7 w-7"
        />
      );

    case "YouTube":
      return (
        <img
          src={youtube.src}
          alt="YouTube"
          className="h-7 w-7"
        />
      );

    case "Facebook":
      return (
        <img
          src={facebook.src}
          alt="Facebook"
          className="h-7 w-7"
        />
      );

    case "X":
      return (
        <img
          src={XIcon.src}
          alt="X"
          className="h-7 w-7"
        />
      );

    default:
      return <ExternalLink size={26} />;
  }
}

export default function StorePage() {
  const params =
    useParams<{ id: string }>();

  const id =
    Number(params.id);

  const [card, setCard] =
    useState<BusinessCard | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!id) return;

    async function loadCard() {
      try {
        setLoading(true);

        const data =
          await getBusinessCard(id);

        setCard(data);
      } catch (error) {
        console.error(error);

        setError(
          "صفحه مورد نظر پیدا نشد."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCard();
  }, [id]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-500">
          در حال بارگذاری...
        </p>
      </main>
    );
  }

  if (error || !card) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
        <div className="rounded-2xl bg-white p-8 text-center shadow">
          <h1 className="text-xl font-bold">
            صفحه پیدا نشد
          </h1>

          <p className="mt-2 text-gray-500">
            ممکن است لینک اشتباه باشد.
          </p>
        </div>
      </main>
    );
  }

  console.log("CARD:", card);
  console.log("IMAGE URL:", card.imageUrl);

  const isDark =
    card.themeName === "Dark";

  const background =
    isDark
      ? "linear-gradient(135deg, #111827, #312e81)"
      : card.backgroundColor ??
        "#FFFFFF";

  return (
    <main
      className="min-h-screen px-4 py-8"
      style={{
        background,
        color:
          card.textColor ??
          "#111827",
      }}
    >

      <div className="mx-auto max-w-md">

        <div
          className="overflow-hidden rounded-[32px] shadow-2xl"
          style={{
            background:
              isDark
                ? "rgba(255,255,255,0.08)"
                : "rgba(255,255,255,0.95)",
          }}
        >

          {/* HEADER */}

          <div className="p-4">

            {card.imageUrl ? (
              <div className="overflow-hidden rounded-2xl bg-white">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="aspect-[3/1] w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex aspect-[3/1] items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                بدون تصویر
              </div>
            )}

          </div>

          {/* TITLE */}

          <div className="px-6 text-center">

            <h1 className="text-2xl font-bold">
              {card.title}
            </h1>

            {card.phone && (
              <a
                href={`tel:${card.phone}`}
                className="mt-2 block text-sm opacity-70"
                dir="ltr"
              >
                {card.phone}
              </a>
            )}

          </div>

          {/* LINKS */}

          {card.links.length > 0 && (
            <div className="mt-7 px-6">

              <div className="flex flex-wrap justify-center gap-3">

                {card.links.map(
                  (link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        link.title ||
                        link.linkType ||
                        "لینک"
                      }
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-800 shadow-md transition hover:scale-105"
                    >
                      <LinkIcon
                        type={
                          link.linkType
                        }
                      />
                    </a>
                  )
                )}

              </div>

            </div>
          )}

          {/* DESCRIPTION */}

          {card.description && (
            <div className="px-6">

              <div className="mt-7 max-h-48 overflow-y-auto rounded-2xl bg-black/5 p-5 text-sm leading-8">

                {card.description}

              </div>

            </div>
          )}

          {/* CONTACT */}

          {(card.phone ||
            card.email) && (
            <div className="mt-6 space-y-3 px-6">

              {card.phone && (
                <a
                  href={`tel:${card.phone}`}
                  className="flex items-center gap-3 rounded-xl bg-white/80 p-4 text-gray-800 shadow-sm"
                >
                  <Phone size={20} />

                  <span dir="ltr">
                    {card.phone}
                  </span>
                </a>
              )}

              {card.email && (
                <a
                  href={`mailto:${card.email}`}
                  className="flex items-center gap-3 rounded-xl bg-white/80 p-4 text-gray-800 shadow-sm"
                >
                  <Mail size={20} />

                  <span>
                    {card.email}
                  </span>
                </a>
              )}

            </div>
          )}


          {/* QR */}

          {card.qrCode && (
            <div className="px-6 pb-8">

              <div className="mt-8 rounded-2xl bg-white p-5 text-center text-gray-800">

                <p className="mb-4 text-sm font-medium">
                  اسکن کنید و صفحه را باز کنید
                </p>

                <img
                  src={card.qrCode}
                  alt={`QR Code ${card.title}`}
                  className="mx-auto w-48"
                />

              </div>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}