export class AppMasks {

    /* Masks */
    public static company_Code_Mask = [/\d/, /\d/, /\d/, /\d/];
    public static phone_Mask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    public static mobile_Mask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    public static ntn_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
    public static cnic_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
    public static secp_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    public static str_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
    public static post_Code_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/];
    public static number_three = [/\d/, /\d/, /\d/]
    public static number_six = [/\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/]
    public static number_nine = [/\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/, ',', /\d/, /\d/, /\d/]

    /* pattern */


}

export class AppPattern {
    public static phone_Pattern:RegExp = /^[0-9+]{3}-[0-9+]{8}$/;
    public static post_Code_Pattern:RegExp = /^[0-9+]{5}$/;
    public static mobile_Pattern:RegExp = /^[0-9+]{4}-[0-9+]{7}$/;
    public static ntn_Pattern:RegExp = /^([0-9+]{7}-[0-9+]{1}|[0-9+]{7})$/;
    public static secp_Pattern:RegExp = /[0-9]+/;
    public static email_Pattern:RegExp = /^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/;
    public static cnic_Pattern:RegExp = /^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$/;
    public static str_Pattern:RegExp = /[0-9]+/;
    public static number:RegExp = /^[1-9][0-9]*$/;
    public static alphaNumericOnly:RegExp = /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$/;
    public static password:RegExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/
    // /^[0-9+]{7}-[0-9+]{1}$/

}