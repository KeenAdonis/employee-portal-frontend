"use client"

import * as React from "react"

import {
    DayPicker,
    useDayPicker,
    type DayPickerProps,
} from "react-day-picker"

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

function CustomCaption({
    displayMonth,
}: {
    displayMonth: Date
}) {

    const {
        goToMonth,
        nextMonth,
        previousMonth,
    } = useDayPicker()

    const [showMonths, setShowMonths] =
        React.useState(false)

    const [showYears, setShowYears] =
        React.useState(false)

    const currentMonth =
        displayMonth.getMonth()

    const currentYear =
        displayMonth.getFullYear()

    const years = Array.from(
        { length: 120 },
        (_, i) => currentYear - 80 + i
    )

    return (

        <div
            className="
                relative
                flex items-center justify-center
                pb-4
            "
        >

            {/* LEFT */}
            <button
                type="button"

                disabled={!previousMonth}

                onClick={() => {
                    if (previousMonth) {
                        goToMonth(previousMonth)
                    }
                }}

                className="
                    absolute left-0

                    h-9 w-9
                    rounded-xl

                    flex items-center justify-center

                    hover:bg-gray-100
                    disabled:opacity-40

                    transition-all
                "
            >
                <ChevronLeftIcon
                    className="h-4 w-4"
                />
            </button>

            {/* CENTER */}
            <div
                className="
                    flex items-center gap-2
                "
            >

                {/* MONTH */}
                <div className="relative">

                    <button
                        type="button"

                        onClick={() => {

                            setShowMonths(
                                !showMonths
                            )

                            setShowYears(false)
                        }}

                        className="
                            h-10
                            px-3

                            rounded-xl

                            flex items-center gap-1

                            text-[20px]
                            font-semibold

                            hover:bg-gray-100

                            transition-all
                        "
                    >

                        {MONTHS[currentMonth]}

                        <ChevronDownIcon
                            className="
                                h-4 w-4
                                text-gray-500
                            "
                        />

                    </button>

                    {/* MONTH PANEL */}
                    {showMonths && (

                        <div
                            className="
                                absolute
                                top-12
                                left-1/2
                                -translate-x-1/2
                                z-50

                                w-44
                                max-h-72
                                overflow-y-auto

                                rounded-2xl
                                border
                                border-gray-100

                                bg-white
                                shadow-xl

                                p-2
                            "
                        >

                            {MONTHS.map(
                                (month, index) => (

                                    <button
                                        key={month}

                                        type="button"

                                        onClick={() => {

                                            goToMonth(
                                                new Date(
                                                    currentYear,
                                                    index
                                                )
                                            )

                                            setShowMonths(false)
                                        }}

                                        className={cn(
                                            `
                                                w-full
                                                rounded-xl

                                                px-3 py-2

                                                text-left
                                                text-sm

                                                hover:bg-gray-100

                                                transition-all
                                            `,
                                            index === currentMonth &&
                                            "bg-indigo-50 text-indigo-600 font-medium"
                                        )}
                                    >

                                        {month}

                                    </button>
                                )
                            )}

                        </div>
                    )}

                </div>

                {/* YEAR */}
                <div className="relative">

                    <button
                        type="button"

                        onClick={() => {

                            setShowYears(
                                !showYears
                            )

                            setShowMonths(false)
                        }}

                        className="
                            h-10
                            px-3

                            rounded-xl

                            flex items-center gap-1

                            text-[20px]
                            font-semibold

                            hover:bg-gray-100

                            transition-all
                        "
                    >

                        {currentYear}

                        <ChevronDownIcon
                            className="
                                h-4 w-4
                                text-gray-500
                            "
                        />

                    </button>

                    {/* YEAR PANEL */}
                    {showYears && (

                        <div
                            className="
                                absolute
                                top-12
                                left-0
                                z-50

                                w-32
                                max-h-72
                                overflow-y-auto

                                rounded-2xl
                                border
                                border-gray-100

                                bg-white
                                shadow-xl

                                p-2
                            "
                        >

                            {years.map((year) => (

                                <button
                                    key={year}

                                    type="button"

                                    onClick={() => {

                                        goToMonth(
                                            new Date(
                                                year,
                                                currentMonth
                                            )
                                        )

                                        setShowYears(false)
                                    }}

                                    className={cn(
                                        `
                                            w-full
                                            rounded-xl

                                            px-3 py-2

                                            text-center
                                            text-sm

                                            hover:bg-gray-100

                                            transition-all
                                        `,
                                        year === currentYear &&
                                        "bg-indigo-50 text-indigo-600 font-medium"
                                    )}
                                >

                                    {year}

                                </button>
                            ))}

                        </div>
                    )}

                </div>

            </div>

            {/* RIGHT */}
            <button
                type="button"

                disabled={!nextMonth}

                onClick={() => {
                    if (nextMonth) {
                        goToMonth(nextMonth)
                    }
                }}

                className="
                    absolute right-0

                    h-9 w-9
                    rounded-xl

                    flex items-center justify-center

                    hover:bg-gray-100
                    disabled:opacity-40

                    transition-all
                "
            >
                <ChevronRightIcon
                    className="h-4 w-4"
                />
            </button>

        </div>
    )
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    components,
    ...props
}: DayPickerProps) {

    return (

        <DayPicker

            showOutsideDays={showOutsideDays}

            className={cn(
                `
                    bg-white
                    p-4
                    rounded-2xl
                    select-none
                `,
                className
            )}

            classNames={{

                root:
                    `
                        w-[360px]
                    `,

                nav: "hidden",

                months:
                    `
                        flex flex-col
                    `,

                month:
                    `
                        space-y-5
                    `,

                weekdays:
                    `
                        grid grid-cols-7
                        mb-2
                    `,

                weekday:
                    `
                        text-center
                        text-[13px]
                        font-medium
                        text-gray-500
                        pb-2
                    `,

                week:
                    `
                        grid grid-cols-7
                    `,

                day:
                    `
                        h-11 w-11

                        flex items-center justify-center

                        rounded-xl

                        text-sm
                        font-medium

                        transition-all

                        hover:bg-gray-100
                    `,

                today:
                    `
                        border
                        border-gray-300
                        font-semibold
                    `,

                selected:
                    `
                        bg-indigo-600
                        text-white

                        hover:bg-indigo-700
                    `,

                outside:
                    `
                        text-gray-300
                    `,

                disabled:
                    `
                        opacity-40
                        pointer-events-none
                    `,

                hidden:
                    `
                        invisible
                    `,

                ...classNames,
            }}

            components={{

                MonthCaption: ({
                    calendarMonth,
                }) => (
                    <CustomCaption
                        displayMonth={
                            calendarMonth.date
                        }
                    />
                ),

                DayButton: ({
                    className,
                    ...props
                }) => (

                    <Button
                        variant="ghost"
                        size="icon"

                        className={cn(
                            `
                                h-11 w-11
                                rounded-xl

                                font-medium

                                transition-all
                            `,
                            className
                        )}

                        {...props}
                    />
                ),

                ...components,
            }}

            {...props}
        />
    )
}

export {
    Calendar,
}