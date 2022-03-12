const  Recommendation = allHotelS => {

    const array_name = [];

    for (let i = 0; i <allHotelS.length; i++) {
        array_name.push(allHotelS[i]);
    }

    const max = Math.max(...array_name)

    let _50 = max / 2;

    let rec = [];

    for (let i = 0; i < array_name.length; i++) {
        if (array_name[i] >= _50) {
            rec.push(String(i + 1));
        }
    }

    return rec;

}

module.exports = Recommendation;