"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepperProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export default function Stepper({ steps, currentStep, className }: StepperProps) {
    return (
        <div className={cn("w-full", className)}>
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={cn(
                                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500",
                                    index < currentStep
                                        ? "bg-gradient-to-r from-rose-primary to-rose-light text-white shadow-glass"
                                        : index === currentStep
                                            ? "bg-gradient-to-r from-rose-primary to-rose-light text-white shadow-glass scale-110"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600"
                                )}
                            >
                                {index < currentStep ? (
                                    <Check size={18} />
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span
                                className={cn(
                                    "mt-2 text-xs font-medium text-center max-w-[80px] leading-tight",
                                    index <= currentStep
                                        ? "text-rose-primary"
                                        : "text-gray-400 dark:text-gray-600"
                                )}
                            >
                                {step}
                            </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={cn(
                                    "h-[2px] flex-1 mx-2 rounded-full transition-all duration-500 -mt-6",
                                    index < currentStep
                                        ? "bg-gradient-to-r from-rose-primary to-rose-light"
                                        : "bg-gray-200 dark:bg-gray-800"
                                )}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
