"use client";

import { useTranslation } from "@/lib/LanguageContext";
import { Languages } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
    const { language, setLanguage } = useTranslation();

    const languages = [
        { code: "en", name: "English", display: "English" },
        { code: "am", name: "Amharic", display: "አማርኛ" },
        { code: "om", name: "Afaan Oromo", display: "Afaan Oromoo" },
    ];

    const currentLang = languages.find((l) => l.code === language);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 px-3 gap-2 rounded-xl border-slate-200 dark:border-white/10 dark:bg-white/5">
                    <Languages className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium">{currentLang?.display}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border-slate-200 dark:border-white/10 dark:bg-slate-900 shadow-xl">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as any)}
                        className={`flex items-center justify-between gap-8 px-4 py-2 cursor-pointer transition-colors ${
                            language === lang.code ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" : "hover:bg-slate-100 dark:hover:bg-white/5"
                        }`}
                    >
                        <span className="font-medium">{lang.display}</span>
                        {language === lang.code && <div className="w-2 h-2 rounded-full bg-current" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
