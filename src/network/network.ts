import axios from 'axios';

export type HotelType = {
  date: string;
  city: string;
  link: string;
  name: string;
  photo: string;
  foodType: string;
  price: string;
  id: number;
};

export class Network {
  private url: string = 'http://search.tez-tour.com';
  private countryId: number = 0; // id страны отдыха;
  private cityId: number = 345; // id города вылета

  private priceMin = 0; //минимальная стоимость отдыха;
  private priceMax = 999999; //max стоимость отдыха;

  private before = ''; //верхняя планка диапазона даты заезда; 31.05.2010
  private after = ''; //нижняя планка диапазона даты заезда; 21.05.2010

  private currencyId = 5561; // id валюты, в которой указана цена;

  public nightsMin: null | number = null; //минимальное количество ночей, проведенных в отеле;
  public nightsMax: null | number = null; // максимальное количество ночей, проведенных в отеле;

  private hotelClassId = 2569; // id уровня отеля(звездность);
  private hotelClassBetter = true;
  private accommodationId = 2; //– id размещения;
  private rAndBId = 2424; // id пансиона;
  private rAndBBetter = true;

  public hotels: HotelType[] = [];

  // private mock = {
  //   success: true,
  //   serverName: 'test',
  //   message: 'ok',
  //   data: [
  //     [
  //       '20.05.2024',
  //       [],
  //       'Пн',
  //       8,
  //       '28.05',
  //       ['Сиде', 'ANTALYA', 12691, 7078305, 'Анталия', 1285, 'Анталия', 1285, 'Сиде'],
  //       [
  //         'https://www.tez-tour.com/hotel.html?id=326222',
  //         'SELGE HOTEL 3 *',
  //         'https://s.tez-tour.com/hotel/50003736/DSC_1088_8707_small.JPG',
  //         326222,
  //         '/hotel.html?id=326222',
  //       ],
  //       ['BB', 'Только завтраки', 2424, 30605],
  //       [160053, 'Economy Room', 103014],
  //       [[1, 0, 0]],
  //       {
  //         currency: '$',
  //         currencyId: 5561,
  //         residences: ['0'],
  //         flightsTo: [
  //           {
  //             description: 'adult',
  //             touristCount: 1,
  //             price: '0',
  //           },
  //         ],
  //         flightsFrom: [
  //           {
  //             description: 'adult',
  //             touristCount: 1,
  //             price: '0',
  //           },
  //         ],
  //         insurance: '0',
  //         other: '0',
  //         priceTypes: [true, true, true, true],
  //         specialSell: true,
  //         total: '449.3326',
  //       },
  //       [
  //         [
  //           'https://online.tez-tour.com/armmanager/workplace/section/new-order?depCity=345&arrivalCity=345&hotStType=1&locale=ru&priceOfferId=21961578&cResId=276031577528&cFlyIds=231940040&ftt=3635&ltt=3635&ftv=&ltv=&sk=1&promo=1&rar=1285&rdr=1285',
  //           '',
  //         ],
  //       ],
  //       'Есть',
  //       [
  //         {
  //           to: {
  //             first: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             business: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             econom: {
  //               seatSet: 'Few',
  //               charge: '0',
  //               childCharge: '0',
  //               infantCharge: '0',
  //             },
  //             premiumEconom: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             price: '173.14',
  //           },
  //           from: {
  //             first: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             business: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             econom: {
  //               seatSet: 'Few',
  //               charge: '0',
  //               childCharge: '0',
  //               infantCharge: '0',
  //             },
  //             premiumEconom: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             price: '173.14',
  //           },
  //         },
  //       ],
  //       {
  //         baseHotel: {
  //           value: true,
  //           comment: 'Tez рекомендует',
  //         },
  //         earlyBooking: {
  //           value: false,
  //         },
  //         onlineConfirm: {
  //           value: false,
  //         },
  //         pack: {
  //           value: false,
  //         },
  //         topPriority: {
  //           value: false,
  //         },
  //         exclusive: {
  //           value: false,
  //         },
  //         flexComission: {
  //           value: false,
  //         },
  //         fixComission: {
  //           value: true,
  //           comment: 'Фиксированная комиссия',
  //           text: ['8.0 %'],
  //         },
  //         luxuryHotel: {
  //           value: false,
  //         },
  //         externalFlights: {
  //           value: false,
  //         },
  //         sber: {
  //           value: false,
  //         },
  //         blackFriday: {
  //           value: false,
  //         },
  //         balttour: {
  //           value: false,
  //         },
  //         extraServices: {
  //           value: false,
  //         },
  //         promos: [],
  //         residenceGds: {
  //           value: false,
  //         },
  //       },
  //       1,
  //       ['Москва', 'Россия'],
  //       60569,
  //       '',
  //       '',
  //       {},
  //       '',
  //       [3635, 3635],
  //       [{}, {}],
  //       {},
  //       {},
  //     ],
  //     [
  //       '21.05.2024',
  //       [],
  //       'Вт',
  //       8,
  //       '29.05',
  //       ['Сиде', 'ANTALYA', 12691, 7078305, 'Анталия', 1285, 'Анталия', 1285, 'Сиде'],
  //       [
  //         'https://www.tez-tour.com/hotel.html?id=326222',
  //         'SELGE HOTEL 3 *',
  //         'https://s.tez-tour.com/hotel/50003736/DSC_1088_8707_small.JPG',
  //         326222,
  //         '/hotel.html?id=326222',
  //       ],
  //       ['BB', 'Только завтраки', 2424, 30605],
  //       [160053, 'Economy Room', 103014],
  //       [[1, 0, 0]],
  //       {
  //         currency: '$',
  //         currencyId: 5561,
  //         residences: ['0'],
  //         flightsTo: [
  //           {
  //             description: 'adult',
  //             touristCount: 1,
  //             price: '0',
  //           },
  //         ],
  //         flightsFrom: [
  //           {
  //             description: 'adult',
  //             touristCount: 1,
  //             price: '0',
  //           },
  //         ],
  //         insurance: '0',
  //         other: '0',
  //         priceTypes: [true, true, true, true],
  //         specialSell: true,
  //         total: '449.3326',
  //       },
  //       [
  //         [
  //           'https://online.tez-tour.com/armmanager/workplace/section/new-order?depCity=345&arrivalCity=345&hotStType=1&locale=ru&priceOfferId=21961578&cResId=276031577530&cFlyIds=231940066&ftt=3635&ltt=3635&ftv=&ltv=&sk=1&promo=1&rar=1285&rdr=1285',
  //           '',
  //         ],
  //       ],
  //       'Есть',
  //       [
  //         {
  //           to: {
  //             first: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             business: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             econom: {
  //               seatSet: 'Few',
  //               charge: '0',
  //               childCharge: '0',
  //               infantCharge: '0',
  //             },
  //             premiumEconom: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             price: '173.14',
  //           },
  //           from: {
  //             first: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             business: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             econom: {
  //               seatSet: 'Few',
  //               charge: '0',
  //               childCharge: '0',
  //               infantCharge: '0',
  //             },
  //             premiumEconom: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             price: '173.14',
  //           },
  //         },
  //       ],
  //       {
  //         baseHotel: {
  //           value: true,
  //           comment: 'Tez рекомендует',
  //         },
  //         earlyBooking: {
  //           value: false,
  //         },
  //         onlineConfirm: {
  //           value: false,
  //         },
  //         pack: {
  //           value: false,
  //         },
  //         topPriority: {
  //           value: false,
  //         },
  //         exclusive: {
  //           value: false,
  //         },
  //         flexComission: {
  //           value: false,
  //         },
  //         fixComission: {
  //           value: true,
  //           comment: 'Фиксированная комиссия',
  //           text: ['8.0 %'],
  //         },
  //         luxuryHotel: {
  //           value: false,
  //         },
  //         externalFlights: {
  //           value: false,
  //         },
  //         sber: {
  //           value: false,
  //         },
  //         blackFriday: {
  //           value: false,
  //         },
  //         balttour: {
  //           value: false,
  //         },
  //         extraServices: {
  //           value: false,
  //         },
  //         promos: [],
  //         residenceGds: {
  //           value: false,
  //         },
  //       },
  //       1,
  //       ['Москва', 'Россия'],
  //       60569,
  //       '',
  //       '',
  //       {},
  //       '',
  //       [3635, 3635],
  //       [{}, {}],
  //       {},
  //       {},
  //     ],
  //     [
  //       '23.05.2024',
  //       [],
  //       'Чт',
  //       8,
  //       '31.05',
  //       ['Сиде', 'ANTALYA', 12691, 7078305, 'Анталия', 1285, 'Анталия', 1285, 'Сиде'],
  //       [
  //         'https://www.tez-tour.com/hotel.html?id=326222',
  //         'SELGE HOTEL 3 *',
  //         'https://s.tez-tour.com/hotel/50003736/DSC_1088_8707_small.JPG',
  //         326222,
  //         '/hotel.html?id=326222',
  //       ],
  //       ['BB', 'Только завтраки', 2424, 30605],
  //       [160053, 'Economy Room', 103014],
  //       [[1, 0, 0]],
  //       {
  //         currency: '$',
  //         currencyId: 5561,
  //         residences: ['0'],
  //         flightsTo: [
  //           {
  //             description: 'adult',
  //             touristCount: 1,
  //             price: '0',
  //           },
  //         ],
  //         flightsFrom: [
  //           {
  //             description: 'adult',
  //             touristCount: 1,
  //             price: '0',
  //           },
  //         ],
  //         insurance: '0',
  //         other: '0',
  //         priceTypes: [true, true, true, true],
  //         specialSell: true,
  //         total: '449.3326',
  //       },
  //       [
  //         [
  //           'https://online.tez-tour.com/armmanager/workplace/section/new-order?depCity=345&arrivalCity=345&hotStType=1&locale=ru&priceOfferId=21961578&cResId=276031577534&cFlyIds=231940118&ftt=3635&ltt=3635&ftv=&ltv=&sk=1&promo=1&rar=1285&rdr=1285',
  //           '',
  //         ],
  //       ],
  //       'Есть',
  //       [
  //         {
  //           to: {
  //             first: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             business: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             econom: {
  //               seatSet: 'Few',
  //               charge: '0',
  //               childCharge: '0',
  //               infantCharge: '0',
  //             },
  //             premiumEconom: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             price: '173.14',
  //           },
  //           from: {
  //             first: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             business: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             econom: {
  //               seatSet: 'Few',
  //               charge: '0',
  //               childCharge: '0',
  //               infantCharge: '0',
  //             },
  //             premiumEconom: {
  //               seatSet: 'No',
  //               charge: '0',
  //             },
  //             price: '173.14',
  //           },
  //         },
  //       ],
  //       {
  //         baseHotel: {
  //           value: true,
  //           comment: 'Tez рекомендует',
  //         },
  //         earlyBooking: {
  //           value: false,
  //         },
  //         onlineConfirm: {
  //           value: false,
  //         },
  //         pack: {
  //           value: false,
  //         },
  //         topPriority: {
  //           value: false,
  //         },
  //         exclusive: {
  //           value: false,
  //         },
  //         flexComission: {
  //           value: false,
  //         },
  //         fixComission: {
  //           value: true,
  //           comment: 'Фиксированная комиссия',
  //           text: ['8.0 %'],
  //         },
  //         luxuryHotel: {
  //           value: false,
  //         },
  //         externalFlights: {
  //           value: false,
  //         },
  //         sber: {
  //           value: false,
  //         },
  //         blackFriday: {
  //           value: false,
  //         },
  //         balttour: {
  //           value: false,
  //         },
  //         extraServices: {
  //           value: false,
  //         },
  //         promos: [],
  //         residenceGds: {
  //           value: false,
  //         },
  //       },
  //       1,
  //       ['Москва', 'Россия'],
  //       60569,
  //       '',
  //       '',
  //       {},
  //       '',
  //       [3635, 3635],
  //       [{}, {}],
  //       {},
  //       {},
  //     ],
  //   ],
  //   departureCityId: 345,
  //   arrivalCountryId: 1104,
  // };

  constructor() {
    // this.mock.data.forEach((item: any, index: number) => this.parseHotelResponse(item, index));
  }

  public setCountryId(value: number): void {
    this.countryId = value;
  }

  public setCityId(value: number): void {
    this.cityId = value;
  }

  public setCurrencyId(value: number): void {
    this.currencyId = value;
  }

  public setMaxPrice(value: number): void {
    this.priceMax = value;
  }

  public setDate(after: string, before: string): void {
    this.before = before;
    this.after = after;
  }

  public setMinNights(value: number): void {
    this.nightsMin = value;
  }

  public setMaxNights(value: number): void {
    this.nightsMax = value;
  }

  public setHotelClassId(value: number): void {
    this.hotelClassId = value;
  }

  public setRAndBId(value: number): void {
    this.rAndBId = value;
  }

  public async getHotelsListRequest(): Promise<void> {
    await axios({
      method: 'get',
      url: `${this.url}/tariffsearch/getResult?accommodationId=${this.accommodationId}&after=${this.after}&before=${this.before}&cityId=${this.cityId}&countryId=${this.countryId}&nightsMin=${this.nightsMin}&nightsMax=${this.nightsMax}&currency=${this.currencyId}&priceMin=${this.priceMin}&priceMax=${this.priceMax}&hotelClassId=${this.hotelClassId}&hotelClassBetter=${this.hotelClassBetter}&rAndBId=${this.rAndBId}&rAndBBetter=${this.rAndBBetter}`,
    })
      .then((response: IResponse) => {
        response.data.data.forEach((item: any, index: number) =>
          this.parseHotelResponse(item, index),
        );
      })
      .catch(() => {});
  }

  private parseHotelResponse(item: any, id: number): void {
    this.hotels.push(<HotelType>{
      city: item[5][6],
      date: item[0],
      foodType: item[7][1],
      link: item[6][0],
      price: `${Math.ceil(<number>item[10]['total'])} ${item[10]['currency']}`,
      photo: item[6][2],
      name: item[6][1],
      id,
    });
  }

  public clear(): void {
    this.nightsMin = null;
    this.nightsMax = null;
  }
}

export interface IResponse {
  status: number;
  statusText: string;
  data: {
    success: boolean;
    message: string;
    serverName: string;
    departureCityId: number;
    arrivalCountryId: number;
    data: any;
  };
}

//data[0] - отель
//data[0][0] - "13.06.2024"
//data[0][5][4] - "Анталия"
//data[0][6][0] - ссылка https://www.tez-tour.com/hotel.html?id=326222
//data[0][6][1] - название отеля "SELGE HOTEL 3 *"
//data[0][6][2] - фото  "https://s.tez-tour.com/hotel/50003736/DSC_1088_8707_small.JPG"
//data[0][7][1] - только завтраки
//data[0][10]["currency"] - валюта $
//data[0][10]["total"] - 450
