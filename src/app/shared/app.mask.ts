export class AppMasks {

/* Masks */
public static company_Code_Mask = [/\d/, /\d/, /\d/, /\d/];
public static phone_Mask = [/\d/, /\d/, /\d/, '-', /\d/, /\d/,/\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
public static mobile_Mask = [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,/\d/, /\d/, /\d/, /\d/, /\d/];
public static ntn_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/, /\d/,/\d/, '-', /\d/];
public static cnic_Mask = [/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/,/\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/];
public static secp_Mask =[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/,/\d/];
public static str_Mask =[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/,/\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];
public static post_Code_Mask =[/\d/, /\d/, /\d/, /\d/, /\d/];
public static number_three = [/\d/,/\d/,/\d/]
public static number_six = [/\d/,/\d/,/\d/,',',/\d/,/\d/,/\d/]
public static number_nine = [/\d/,/\d/,/\d/,',',/\d/,/\d/,/\d/,',',/\d/,/\d/,/\d/]

/* pattern */


}

export class AppPattern {
    public static phone_Pattern="^[0-9+]{3}-[0-9+]{8}$";
    public static post_Code_Pattern = "^[0-9+]{5}$";
    public static mobile_Pattern = "^[0-9+]{4}-[0-9+]{7}$";
    public static ntn_Pattern = "^([0-9+]{7}-[0-9+]{1}|[0-9+]{7})$";
    public static secp_Pattern = "[0-9]+";
    public static email_Pattern = "^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
    public static cnic_Pattern = "^[0-9+]{5}-[0-9+]{7}-[0-9]{1}$";
public static str_Pattern = "[0-9]+";
// ^[0-9+]{7}-[0-9+]{1}$

}