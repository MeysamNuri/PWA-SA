export interface IUserProfileDataRes {
    firstName: string;
    lastName: string;
    businessName: string;
    phoneNumber: string;
    getUserProfileDtos?: [
        {
          isActive: true,
          serial: string,
          cloudDBName: string,
          guaranteeDate: string
        }
      ],
      hasSerial: true
}
