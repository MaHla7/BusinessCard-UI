"use client";

import {
  DragEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { getThemes } from "../../services/themeService";

import {
  createBusinessCard,
  uploadBusinessCardImage,
} from "../../services/businessCardService";

import { Theme } from "../../types/theme";

import {
  CreateBusinessCardLink,
} from "../../types/businessCard";

import { linkTypes } from "../../types/link";

import {
  Trash2,
  Plus,
  Upload,
  Send,
  Globe,
  MessageCircle,
  X,
  AtSign,
  Play,
  Users,
} from "lucide-react";


function LinkIcon({
  type,
}: {
  type?: string;
}) {
  const props = {
    size: 22,
    strokeWidth: 1.8,
  };

  switch (type) {
    case "Instagram":
      return <AtSign {...props} />;

    case "Telegram":
      return <Send {...props} />;

    case "WhatsApp":
      return <MessageCircle {...props} />;

    case "Website":
      return <Globe {...props} />;

    case "LinkedIn":
      return <Users {...props} />;

    case "YouTube":
      return <Play {...props} />;

    case "Facebook":
      return <Users {...props} />;

    case "X":
      return <X {...props} />;

    default:
      return <Globe {...props} />;
  }
}


export default function CreatePage() {
  const router = useRouter();

  const [themes, setThemes] = useState<Theme[]>([]);

  const [selectedTheme, setSelectedTheme] =
    useState<number | null>(null);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState("");

  const [links, setLinks] =
    useState<CreateBusinessCardLink[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] = useState("");


  useEffect(() => {
    async function loadThemes() {
      try {
        const data = await getThemes();

        setThemes(data);

        if (data.length > 0) {
          setSelectedTheme(data[0].id);
        }
      } catch (error) {
        console.error(error);

        setError(
          "دریافت قالب‌ها با خطا مواجه شد."
        );
      }
    }

    loadThemes();
  }, []);


  function addLink() {
    setLinks((previous) => [
      ...previous,
      {
        title: "اینستاگرام",
        url: "",
        linkType: "Instagram",
        displayOrder:
          previous.length + 1,
        isActive: true,
      },
    ]);
  }


  function removeLink(index: number) {
    setLinks((previous) =>
      previous.filter(
        (_, i) => i !== index
      )
    );
  }


  function updateLink(
    index: number,
    field: keyof CreateBusinessCardLink,
    value: string | boolean
  ) {
    debugger
    setLinks((previous) =>
      previous.map((link, i) =>{
        if(i !== index){
          return link;
        }

        if(field === "linkType"){
          const selectedType = linkTypes.find(
            (type) => type.value == value
          );

          return{
            ...link,
            linkType: value as string,
            title: selectedType?.label ?? "",
          };
        }
        return{
          ...link,
          [field]: value,
        };
      })
    );
  }


  function handleImageSelect(file: File) {
    if (!file.type.startsWith("image/")) {
      setError(
        "لطفاً یک فایل تصویری انتخاب کنید."
      );

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "حجم تصویر نباید بیشتر از ۵ مگابایت باشد."
      );

      return;
    }

    const image = new Image();

    const objectUrl =
      URL.createObjectURL(file);

    image.onload = () => {
      const ratio =
        image.width / image.height;

      URL.revokeObjectURL(objectUrl);

      if (
        ratio < 2.2 ||
        ratio > 3.6
      ) {
        setError(
          "نسبت تصویر هدر باید حدود ۳ به ۱ باشد. پیشنهاد: ۱۲۰۰×۴۰۰ پیکسل."
        );

        return;
      }

      setError("");

      setImageFile(file);

      setImagePreview(
        URL.createObjectURL(file)
      );
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      setError(
        "خواندن تصویر امکان‌پذیر نیست."
      );
    };

    image.src = objectUrl;
  }


  function handleImageDrop(
    event: DragEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    const file =
      event.dataTransfer.files[0];

    if (file) {
      handleImageSelect(file);
    }
  }


  function removeImage() {
    setImageFile(null);
    setImagePreview("");
  }


  async function handleSubmit(event: FormEvent<HTMLFormElement>)
  {
    debugger
    event.preventDefault();

    setError("");

    if (!title.trim()) {
      setError(
        "وارد کردن عنوان الزامی است."
      );

      return;
    }

    if (!imageFile) {
      setError(
        "لطفاً تصویر هدر را انتخاب کنید."
      );

      return;
    }

    try {
      setLoading(true);

      const id =
        await createBusinessCard({
          title,
          description,
          phone,
          email,
          themeId: selectedTheme,
          links,
        });

      await uploadBusinessCardImage(
        id,
        imageFile
      );

      router.push(`/store/${id}`);
    }catch (error) {
  console.error(error);

  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

    if (data?.errors) {
      const messages = Object.values(data.errors)
        .flat()
        .filter(
          (message): message is string =>
            typeof message === "string"
        );

      if (messages.length > 0) {
        setError(messages.join(" "));
        return;
      }
    }

    if (data?.message) {
      setError(data.message);
      return;
    }
  }

  setError(
    "ساخت صفحه معرفی با خطا مواجه شد. لطفاً دوباره تلاش کنید."
  );
}
  }


  const selectedThemeData =
    themes.find(
      (theme) =>
        theme.id === selectedTheme
    );

  const isDark =
    selectedThemeData?.name === "Dark";


  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">

      <div className="mx-auto max-w-6xl">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">
            ساخت کارت ویزیت دیجیتال
          </h1>

          <p className="mt-2 text-gray-500">
            اطلاعات کسب‌وکار خود را وارد کنید.
          </p>

        </div>


        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}


        <div className="grid gap-8 lg:grid-cols-2">

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* اطلاعات اصلی */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold">
                اطلاعات اصلی
              </h2>

{/* تصویر هدر */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-2 text-lg font-bold">
                تصویر هدر
              </h2>

              <p className="mb-4 text-sm text-gray-500">
                اندازه پیشنهادی:{" "}
                <strong>
                  ۱۲۰۰×۴۰۰ پیکسل
                </strong>{" "}
                — نسبت ۳:۱
              </p>


              {!imagePreview ? (

                <div
                  onDrop={handleImageDrop}
                  onDragOver={(e) =>
                    e.preventDefault()
                  }
                  className="cursor-pointer rounded-2xl border-2 border-dashed border-gray-300 p-10 text-center transition hover:border-blue-500"
                  onClick={() =>
                    document
                      .getElementById(
                        "image-input"
                      )
                      ?.click()
                  }
                >

                  <Upload
                    size={36}
                    className="mx-auto mb-4 text-gray-400"
                  />

                  <p className="font-medium">
                    تصویر را اینجا رها کنید
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    یا برای انتخاب فایل کلیک کنید
                  </p>

                  <p className="mt-3 text-xs text-gray-400">
                    حداکثر ۵ مگابایت
                  </p>


                  <input
                    id="image-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {

                      const file =
                        e.target.files?.[0];

                      if (file) {
                        handleImageSelect(file);
                      }

                    }}
                  />

                </div>

              ) : (

                <div className="relative overflow-hidden rounded-2xl border">

                  <img
                    src={imagePreview}
                    alt="پیش‌نمایش"
                    className="aspect-[3/1] w-full object-contain"
                  />

                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute left-3 top-3 rounded-lg bg-red-500 p-2 text-white"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              )}

            </div>


              <div className="space-y-4">

                <div>

                  <label className="mb-2 block text-sm font-medium">
                    نام فروشگاه / کسب‌وکار
                  </label>

                  <input
                    value={title}
                    onChange={(e) =>
                      setTitle(e.target.value)
                    }
                    placeholder="مثلاً تیتو کالا"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium">
                    توضیحات
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows={5}
                    placeholder="توضیح کوتاهی درباره کسب‌وکار..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium">
                    شماره تماس
                  </label>

                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value)
                    }
                    dir="ltr"
                    placeholder="09123456789"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-sm font-medium">
                    ایمیل
                  </label>

                  <input
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    dir="ltr"
                    placeholder="example@email.com"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-blue-500"
                  />

                </div>

              </div>

            </div>


            {/* قالب‌ها */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <h2 className="mb-5 text-lg font-bold">
                انتخاب قالب
              </h2>


              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {themes.map((theme) => (

                  <button
                    key={theme.id}
                    type="button"
                    onClick={() =>
                      setSelectedTheme(
                        theme.id
                      )
                    }
                    className={`rounded-xl border-2 p-3 text-right transition ${
                      selectedTheme === theme.id
                        ? "border-blue-500"
                        : "border-gray-200"
                    }`}
                  >

                    <div
                      className="mb-3 h-12 rounded-lg"
                      style={{
                        background:
                          theme.name === "Dark"
                            ? "linear-gradient(135deg, #111827, #312e81)"
                            : theme.backgroundColor,
                      }}
                    />

                    <span className="text-sm font-medium">
                      {theme.name}
                    </span>

                  </button>

                ))}

              </div>

            </div>


            {/* لینک‌ها */}

            <div className="rounded-2xl bg-white p-6 shadow-sm">

              <div className="mb-5 flex items-center justify-between">

                <div>

                  <h2 className="text-lg font-bold">
                    لینک‌ها
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    راه‌های ارتباطی خود را اضافه کنید.
                  </p>

                </div>


                <button
                  type="button"
                  onClick={addLink}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm text-white"
                >
                  <Plus size={18} />
                  افزودن لینک
                </button>

              </div>


              <div className="space-y-4">

                {links.map(
                  (link, index) => (

                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 p-4"
                    >

                      <div className="mb-3 flex items-center justify-between">

                        <div className="flex items-center gap-2">

                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">

                            <LinkIcon
                              type={
                                link.linkType
                              }
                            />

                          </div>


                          <span className="font-medium">
                            لینک {index + 1}
                          </span>

                        </div>


                        <button
                          type="button"
                          onClick={() =>
                            removeLink(index)
                          }
                          className="text-red-500"
                        >
                          <Trash2 size={18} />
                        </button>

                      </div>


                      <div className="space-y-3">

                        <select
                          value={
                            link.linkType
                          }
                          onChange={(e) =>
                            updateLink(
                              index,
                              "linkType",
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3"
                        >

                          {linkTypes.map(
                            (type) => (

                              <option
                                key={
                                  type.value
                                }
                                value={
                                  type.value
                                }
                              >
                                {type.label}
                              </option>

                            )
                          )}

                        </select>


                        <input
                          value={link.url}
                          onChange={(e) =>
                            updateLink(
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          dir="ltr"
                          placeholder="https://..."
                          className="w-full rounded-xl border border-gray-200 px-4 py-3"
                        />

                      </div>

                    </div>

                  )
                )}


                {links.length === 0 && (

                  <div className="rounded-xl border border-dashed p-6 text-center text-gray-400">
                    هنوز لینکی اضافه نکرده‌اید.
                  </div>

                )}

              </div>

            </div>


            {/* دکمه ساخت */}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-blue-600 py-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "در حال ساخت..."
                : "ساخت صفحه معرفی"}
            </button>

          </form>


          {/* -----------------------PREVIEW--------------------------------- */}

          <div className="lg:sticky lg:top-6 lg:self-start">

            <div className="mb-3 text-center text-sm text-gray-500">
              پیش‌نمایش صفحه
            </div>


            <div
              className="overflow-hidden rounded-[32px] shadow-xl"
              style={{
                background:
                  isDark
                    ? "linear-gradient(135deg, #111827, #312e81)"
                    : selectedThemeData?.backgroundColor ??
                      "#FFFFFF",

                color:
                  selectedThemeData?.textColor ??
                  "#111827",
              }}
            >

              <div className="p-5">

                {imagePreview && (

                  <div className="overflow-hidden rounded-2xl bg-white">

                    <img
                      src={imagePreview}
                      alt={title}
                      className="aspect-[3/1] w-full object-contain"
                    />

                  </div>

                )}


                <div className="mt-5 text-center">

                  <h2 className="text-2xl font-bold">
                    {title ||
                      "نام کسب‌وکار"}
                  </h2>


                  {phone && (
                    <p className="mt-2 text-sm opacity-70">
                      {phone}
                    </p>
                  )}

                </div>


                <div className="mt-6 flex flex-wrap justify-center gap-3">

                  {links.map(
                    (link, index) => (

                      <div
                        key={index}
                        className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 text-gray-800 shadow"
                      >

                        <LinkIcon
                          type={
                            link.linkType
                          }
                        />

                      </div>

                    )
                  )}

                </div>


                {description && (

                  <div className="mt-6 max-h-40 overflow-y-auto rounded-2xl bg-black/5 p-4 text-sm leading-7">
                    {description}
                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}