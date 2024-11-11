const CalculAge = (birDate) => {
    if (!birDate) return null;

    const birthDate = typeof birDate === 'string' ? new Date(birDate) : birDate;

    if (isNaN(birthDate.getTime())) {
        console.error('Date de naissance invalide');
        return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
};

export default CalculAge;
