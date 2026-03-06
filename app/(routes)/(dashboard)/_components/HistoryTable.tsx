"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Calendar,
  Stethoscope,
  FileText,
  Clock,
  Heart,
  Brain,
  Bone,
  Droplets,
  Eye,
  Activity,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import moment from "moment";
import ViewReportDialog from "./ViewReportDialog";
import { SessionDetail } from "../medical-agent/[sessionId]/page";
import { useTheme } from "next-themes";

type Props = {
  historyList: SessionDetail[];
};

const ITEMS_PER_PAGE = 5;

// Specialty icons mapping for visual enhancement
const specialtyIcon: Record<string, any> = {
  Cardiology: Heart,
  Neurology: Brain,
  Pediatrics: Activity,
  Dermatology: Droplets,
  Orthopedics: Bone,
  Ophthalmology: Eye,
};

function HistoryTable({ historyList }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme } = useTheme();
  
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = mounted && currentTheme === "dark";

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const safeHistoryList = Array.isArray(historyList) ? historyList : [];
  const totalPages = Math.ceil(safeHistoryList.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = safeHistoryList.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [safeHistoryList.length]);

  const formatId = (id: string | number | undefined): string => {
    if (!id) return "N/A";
    const idStr = id.toString();
    return idStr.length > 8 ? idStr.slice(-8) : idStr;
  };

  const getSpecialtyIcon = (specialty: string | undefined) => {
    if (!specialty) return Stethoscope;
    return specialtyIcon[specialty] || Stethoscope;
  };

  const getSpecialtyColor = (specialty: string | undefined): string => {
    const colors: Record<string, string> = {
      Cardiology: isDark ? "from-red-600 to-red-700" : "from-red-500 to-red-600",
      Neurology: isDark ? "from-purple-600 to-purple-700" : "from-purple-500 to-purple-600",
      Pediatrics: isDark ? "from-green-600 to-green-700" : "from-green-500 to-green-600",
      Dermatology: isDark ? "from-yellow-600 to-yellow-700" : "from-yellow-500 to-yellow-600",
      Orthopedics: isDark ? "from-blue-600 to-blue-700" : "from-blue-500 to-blue-600",
      Ophthalmology: isDark ? "from-indigo-600 to-indigo-700" : "from-indigo-500 to-indigo-600",
    };
    return colors[specialty || ""] || (isDark ? "from-gray-700 to-gray-800" : "from-gray-500 to-gray-600");
  };

  // Empty state with dark mode support
  if (safeHistoryList.length === 0) {
    return (
      <div className={`relative overflow-hidden rounded-2xl border shadow-xl ${
        isDark 
          ? "border-gray-800 bg-gray-900" 
          : "border-gray-100 bg-white"
      }`}>
        <div className={`absolute inset-0 ${
          isDark 
            ? "bg-gradient-to-br from-gray-900 via-gray-900 to-gray-900" 
            : "bg-gradient-to-br from-blue-50 via-white to-purple-50"
        } opacity-50`} />
        <div className={`absolute top-0 right-0 w-32 md:w-64 h-32 md:h-64 rounded-full blur-3xl opacity-20 ${
          isDark 
            ? "bg-gradient-to-br from-blue-900 to-purple-900" 
            : "bg-gradient-to-br from-blue-200 to-purple-200"
        }`} />
        <div className={`absolute bottom-0 left-0 w-32 md:w-64 h-32 md:h-64 rounded-full blur-3xl opacity-20 ${
          isDark 
            ? "bg-gradient-to-tr from-indigo-900 to-pink-900" 
            : "bg-gradient-to-tr from-indigo-200 to-pink-200"
        }`} />

        <div className="relative p-8 md:p-16 text-center">
          <div className="flex flex-col items-center gap-4 md:gap-6 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-4 md:p-5 rounded-2xl shadow-lg">
                <FileText className="h-8 w-8 md:h-12 md:w-12 text-white" />
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <h3 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${
                isDark 
                  ? "from-gray-100 to-gray-400" 
                  : "from-gray-900 to-gray-600"
              } bg-clip-text text-transparent`}>
                No consultation history
              </h3>
              <p className={`text-sm md:text-base ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Your previous consultation reports will appear here
              </p>
            </div>

            <Badge
              variant="outline"
              className={`mt-2 md:mt-4 backdrop-blur-sm px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm ${
                isDark 
                  ? "bg-gray-800/50 border-gray-700 text-gray-300" 
                  : "bg-white/50 border-gray-200 text-gray-600"
              }`}
            >
              <Clock className={`h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 ${
                isDark ? "text-blue-400" : "text-blue-500"
              }`} />
              Start a consultation to see your history
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header with stats - responsive */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 rounded-xl border gap-3 ${
        isDark 
          ? "bg-gray-900/50 border-gray-800" 
          : "bg-gradient-to-r from-gray-50 to-white border-gray-100"
      }`}>
        <div className="flex items-center gap-3 md:gap-4">
          <div className={`flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-sm ${
            isDark ? "bg-gray-800" : "bg-white"
          }`}>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 md:p-2 rounded-lg">
              <FileText className="h-3 w-3 md:h-4 md:w-4 text-white" />
            </div>
            <div>
              <p className={`text-[10px] md:text-xs ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}>
                Total Consultations
              </p>
              <p className={`text-lg md:text-2xl font-bold ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}>
                {safeHistoryList.length}
              </p>
            </div>
          </div>

          {totalPages > 1 && (
            <Badge
              variant="secondary"
              className={`px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm shadow-sm ${
                isDark 
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700" 
                  : "bg-white text-gray-600"
              }`}
            >
              Page {currentPage} of {totalPages}
            </Badge>
          )}
        </div>
      </div>

      {/* Cards Container - responsive */}
      <div className="space-y-3">
        {currentItems.map((record, index) => {
          const specialty = record.selectedDoctor?.specialty || "General";
          const IconComponent = getSpecialtyIcon(specialty);
          const colorGradient = getSpecialtyColor(specialty);
          const doctorName =
            record.selectedDoctor?.specialty || "Medical Specialist";
          const doctorPhoto = record.selectedDoctor?.image;
          const isHovered = hoveredRow === record.id?.toString();

          return (
            <div
              key={record.id?.toString() || index}
              className={`group relative overflow-hidden rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                isDark 
                  ? "bg-gray-900 border-gray-800 hover:bg-gray-900/90" 
                  : "bg-white border-gray-100 hover:bg-white"
              }`}
              onMouseEnter={() => setHoveredRow(record.id?.toString() || null)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${colorGradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
              />

              {/* Modern border accent on hover */}
              <div
                className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${colorGradient} transform scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top`}
              />

              <div className="relative p-3 md:p-5">
                {/* Mobile Layout */}
                {isMobile ? (
                  <div className="space-y-3">
                    {/* Doctor header */}
                    <div className="flex items-start gap-3">
                      <div className="relative flex-shrink-0">
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${colorGradient} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                        />
                        <Avatar className="relative h-14 w-14 rounded-xl border-2 border-white shadow-lg">
                          <AvatarImage
                            src={doctorPhoto}
                            alt={doctorName}
                            className="object-cover"
                          />
                          <AvatarFallback
                            className={`bg-gradient-to-br ${colorGradient} text-white text-base font-bold rounded-xl`}
                          >
                            {doctorName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h4 className={`text-base font-semibold truncate ${
                            isDark ? "text-gray-100" : "text-gray-900"
                          }`}>
                            {doctorName}
                          </h4>
                          <Badge
                            variant="secondary"
                            className={`bg-gradient-to-r ${colorGradient} text-white border-0 text-[10px] px-1.5 py-0`}
                          >
                            <IconComponent className="h-2.5 w-2.5 mr-0.5" />
                            {specialty}
                          </Badge>
                        </div>
                        <p className={`text-xs ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`}>
                          ID: {formatId(record.id)}
                        </p>
                      </div>
                    </div>

                    {/* Quick stats row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                        isDark ? "bg-gray-800" : "bg-gray-50"
                      }`}>
                        <Calendar className={`h-3 w-3 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                          {record.createdOn
                            ? moment(record.createdOn).format("MMM D, YYYY")
                            : "N/A"}
                        </span>
                      </div>
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md ${
                        isDark ? "bg-gray-800" : "bg-gray-50"
                      }`}>
                        <Clock className={`h-3 w-3 ${
                          isDark ? "text-gray-500" : "text-gray-500"
                        }`} />
                        <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                          {record.createdOn
                            ? moment(record.createdOn).fromNow()
                            : "No date"}
                        </span>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      <span className={`text-xs ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}>
                        Consultation completed
                      </span>
                    </div>

                    {/* Notes */}
                    <div className="relative">
                      <div className="absolute -left-2 top-3">
                        <div
                          className={`w-2.5 h-2.5 transform rotate-45 border-l border-t transition-colors duration-300 ${
                            isDark 
                              ? "bg-gray-800 border-gray-700 group-hover:bg-gray-900" 
                              : "bg-gray-50 border-gray-200 group-hover:bg-white"
                          }`}
                        />
                      </div>
                      <div className={`rounded-lg p-3 transition-colors duration-300 border ml-2 ${
                        isDark 
                          ? "bg-gray-800 border-gray-700 group-hover:bg-gray-900 group-hover:border-gray-600" 
                          : "bg-gray-50 border-gray-100 group-hover:bg-white group-hover:border-gray-200"
                      }`}>
                        <div className="flex items-start gap-1 mb-1">
                          <MessageCircle className={`h-3 w-3 ${
                            isDark ? "text-gray-600" : "text-gray-400"
                          }`} />
                          <span className={`text-[10px] font-medium ${
                            isDark ? "text-gray-500" : "text-gray-500"
                          }`}>
                            Doctor's Notes
                          </span>
                        </div>
                        <p className={`text-xs line-clamp-2 leading-relaxed ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}>
                          {record.notes ||
                            "No notes available for this consultation"}
                        </p>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex justify-end">
                      <ViewReportDialog record={record} />
                    </div>
                  </div>
                ) : (
                  /* Desktop Layout */
                  <div className="flex items-start gap-5">
                    {/* Doctor Photo with specialty icon overlay */}
                    <div className="relative">
                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${colorGradient} rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}
                      />
                      <Avatar className="relative h-20 w-20 rounded-xl border-2 border-white shadow-lg">
                        <AvatarImage
                          src={doctorPhoto}
                          alt={doctorName}
                          className="object-cover"
                        />
                        <AvatarFallback
                          className={`bg-gradient-to-br ${colorGradient} text-white text-xl font-bold rounded-xl`}
                        >
                          {doctorName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>

                      {/* Specialty icon badge */}
                      <div
                        className={`absolute -bottom-2 -right-2 rounded-full p-2 shadow-lg transform transition-all duration-300 ${
                          isDark ? "bg-gray-800" : "bg-white"
                        } ${isHovered ? "scale-100 rotate-0" : "scale-50 rotate-90 opacity-0"}`}
                      >
                        <IconComponent
                          className={`h-4 w-4 bg-gradient-to-r ${colorGradient} bg-clip-text text-transparent`}
                        />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 grid grid-cols-12 gap-4">
                      {/* Left column - Doctor info */}
                      <div className="col-span-4">
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`text-lg font-semibold ${
                                isDark ? "text-gray-100" : "text-gray-900"
                              }`}>
                                {doctorName}
                              </h4>
                              <Badge
                                variant="secondary"
                                className={`bg-gradient-to-r ${colorGradient} text-white border-0 text-xs px-2 py-0.5`}
                              >
                                <IconComponent className="h-3 w-3 mr-1" />
                                {specialty}
                              </Badge>
                            </div>
                            <p className={`text-sm ${
                              isDark ? "text-gray-500" : "text-gray-500"
                            }`}>
                              Consultation ID: {formatId(record.id)}
                            </p>
                          </div>

                          {/* Quick stats */}
                          <div className="flex flex-wrap items-center gap-3">
                            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md ${
                              isDark ? "bg-gray-800" : "bg-gray-50"
                            }`}>
                              <Calendar className={`h-3.5 w-3.5 ${
                                isDark ? "text-gray-500" : "text-gray-500"
                              }`} />
                              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                                {record.createdOn
                                  ? moment(record.createdOn).format(
                                      "MMM D, YYYY"
                                    )
                                  : "N/A"}
                              </span>
                            </div>
                            <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-md ${
                              isDark ? "bg-gray-800" : "bg-gray-50"
                            }`}>
                              <Clock className={`h-3.5 w-3.5 ${
                                isDark ? "text-gray-500" : "text-gray-500"
                              }`} />
                              <span className={isDark ? "text-gray-300" : "text-gray-700"}>
                                {record.createdOn
                                  ? moment(record.createdOn).fromNow()
                                  : "No date"}
                              </span>
                            </div>
                          </div>

                          {/* Status indicator */}
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                            <span className={`text-xs ${
                              isDark ? "text-gray-400" : "text-gray-600"
                            }`}>
                              Consultation completed
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle column - Notes preview */}
                      <div className="col-span-5">
                        <div className="relative">
                          {/* Message bubble decoration */}
                          <div className="absolute -left-2 top-3">
                            <div
                              className={`w-3 h-3 transform rotate-45 border-l border-t transition-colors duration-300 ${
                                isDark 
                                  ? "bg-gray-800 border-gray-700 group-hover:bg-gray-900" 
                                  : "bg-gray-50 border-gray-200 group-hover:bg-white"
                              }`}
                            />
                          </div>

                          <div className={`rounded-lg p-4 transition-colors duration-300 border ml-2 ${
                            isDark 
                              ? "bg-gray-800 border-gray-700 group-hover:bg-gray-900 group-hover:border-gray-600" 
                              : "bg-gray-50 border-gray-100 group-hover:bg-white group-hover:border-gray-200"
                          }`}>
                            <div className="flex items-start gap-2 mb-2">
                              <MessageCircle className={`h-4 w-4 ${
                                isDark ? "text-gray-600" : "text-gray-400"
                              }`} />
                              <span className={`text-xs font-medium ${
                                isDark ? "text-gray-500" : "text-gray-500"
                              }`}>
                                Doctor's Notes
                              </span>
                            </div>
                            <p className={`text-sm line-clamp-2 leading-relaxed ${
                              isDark ? "text-gray-300" : "text-gray-700"
                            }`}>
                              {record.notes ||
                                "No notes available for this consultation"}
                            </p>
                            {!record.notes && (
                              <Badge
                                variant="outline"
                                className={`mt-2 text-xs ${
                                  isDark 
                                    ? "bg-gray-900 border-gray-700 text-gray-400" 
                                    : "bg-white/50 border-gray-200 text-gray-600"
                                }`}
                              >
                                <AlertCircle className="h-3 w-3 mr-1" />
                                No notes recorded
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right column - Action */}
                      <div className="col-span-3 flex items-center justify-end">
                        <div className="transform transition-all duration-300 group-hover:scale-105">
                          <ViewReportDialog record={record} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Responsive Pagination */}
      {totalPages > 1 && (
        <div className={`rounded-xl border shadow-sm p-3 md:p-4 ${
          isDark 
            ? "bg-gray-900 border-gray-800" 
            : "bg-white border-gray-100"
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 md:gap-3 order-2 sm:order-1">
              <Badge
                variant="outline"
                className={`px-2 md:px-3 py-1 md:py-1.5 text-xs ${
                  isDark 
                    ? "bg-gray-800 border-gray-700 text-gray-300" 
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                {startIndex + 1} - {Math.min(endIndex, safeHistoryList.length)}
              </Badge>
              <span className={`text-xs md:text-sm ${
                isDark ? "text-gray-500" : "text-gray-500"
              }`}>
                of {safeHistoryList.length} consultations
              </span>
            </div>

            <div className="flex items-center justify-center sm:justify-end gap-1 md:gap-2 order-1 sm:order-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`hidden lg:inline-flex h-8 md:h-9 px-2 md:px-3 ${
                  isDark 
                    ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100" 
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronsLeft className="h-3 w-3 md:h-4 md:w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`h-8 md:h-9 px-2 md:px-3 ${
                  isDark 
                    ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100" 
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
              </Button>

              {/* Mobile page indicator */}
              <span className={`text-sm px-2 sm:hidden ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}>
                {currentPage} / {totalPages}
              </span>

              {/* Desktop page numbers */}
              <div className="hidden sm:flex items-center gap-1 px-1 md:px-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={`w-7 md:w-9 h-7 md:h-9 text-xs md:text-sm font-medium ${
                        currentPage === pageNum
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                          : isDark
                            ? "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
                            : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`h-8 md:h-9 px-2 md:px-3 ${
                  isDark 
                    ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100" 
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`hidden lg:inline-flex h-8 md:h-9 px-2 md:px-3 ${
                  isDark 
                    ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100" 
                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                <ChevronsRight className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HistoryTable;