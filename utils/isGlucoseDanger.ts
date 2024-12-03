export function isGlucoseDanger(age: number, timeSelection: string, glucoseRate: number) {
    if (age < 6) {
        if (timeSelection == 'Sebelum Makan' || timeSelection == 'Puasa') {
            if (glucoseRate >= 100 && glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sesudah Makan') {
            if (glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sebelum Tidur') {
            if (glucoseRate >= 110 && glucoseRate <= 200) {
                return false
            } else {
                return true
            }
        }
    } else if (age >= 6 && age <= 12) {
        if (timeSelection == 'Sebelum Makan' || timeSelection == 'Puasa') {
            if (glucoseRate >= 90 && glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sesudah Makan') {
            if (glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sebelum Tidur') {
            if (glucoseRate >= 100 && glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
    } else if (age >= 13 && age <= 19) {
        if (timeSelection == 'Sebelum Makan' || timeSelection == 'Puasa') {
            if (glucoseRate >= 90 && glucoseRate <= 130) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sesudah Makan') {
            if (glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sebelum Tidur') {
            if (glucoseRate >= 90 && glucoseRate <= 150) {
                return false
            } else {
                return true
            }
        }
    } else {
        if (timeSelection == 'Sebelum Makan' || timeSelection == 'Puasa') {
            if (glucoseRate >= 90 && glucoseRate <= 130) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sesudah Makan') {
            if (glucoseRate <= 180) {
                return false
            } else {
                return true
            }
        }
        if (timeSelection == 'Sebelum Tidur') {
            if (glucoseRate >= 90 && glucoseRate <= 150) {
                return false
            } else {
                return true
            }
        }
    }
}