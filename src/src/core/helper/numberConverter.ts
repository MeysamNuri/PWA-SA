export class NumberConverter {

    private static latinToArabicMap: { [key: string]: string } = {
        '0': '٠',
        '1': '١',
        '2': '٢',
        '3': '٣',
        '4': '٤',
        '5': '٥',
        '6': '٦',
        '7': '٧',
        '8': '٨',
        '9': '٩'
    };

    public static latinToArabic(text: string): string {
        if (typeof text !== 'string') {
            console.error('Input is not a valid string');
            return '';
        }
        return text.replace(/\d/g, (digit) => this.latinToArabicMap[digit] || digit);
    }

    public static formatTime(hours: number, minutes: number): string {
        const formattedHours = hours.toString().padStart(2, '0');
        const formattedMinutes = minutes.toString().padStart(2, '0');
        return `${this.latinToArabic(formattedHours)}:${this.latinToArabic(formattedMinutes)}`;
    }
    public static formatNumberWithCommas(number: number): string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    public static formatCurrency(number: number): string {
        const formatted = this.formatNumberWithCommas(number);
        return this.latinToArabic(formatted);
    }
}
