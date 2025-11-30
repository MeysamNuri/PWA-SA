//sendOTPCode types=======
export interface ISendOtpPayload {
  phoneNumber: string;
}
export interface ISendOtpResponse {
  message: string;
}
//end=======================

// loginByOTP types=======
export interface ILoginByotpPayload {
  phoneNumber: string;
  code: string
}
export interface ILoginByotpRes {
  token: string;
  firstLogin:boolean

}
//end========

// change paswword============
export interface IChangePassword {
  confirmPassword: string,
  newPassword: string,
  otpCode: string,
  phoneNumber: string
}


//end================
export interface ILoginFormInputs {
  mobile: string;
  password: string;
  rememberMe?: boolean;
}
