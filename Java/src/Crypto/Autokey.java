package Crypto;

/*
   Autokey encryption and decryption
*/
import java.util.*;
import java.lang.*;
import java.math.*;

public class Autokey{
    private static String alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static void main(String[] args){
        //String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        String[] alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
        String text = "THISISTHEWAYBACKHOME";
        String key = "QUEEN";  //15 - P


        if(key.matches("[-+]?\\d*\\.?\\d+"))
            key = ""+alpha.charAt(Integer.parseInt(key));

        //String enc = AutoEncryption(text,key);

        String enc = "QNXEPKMAEGKLAAELDTPDLHN"; //QUEEN
        //System.out.println("Plaintext : "+text);
        System.out.println("Encrypted : "+enc);
        if(key.length()<2)
            for(String key_x:alphabet)System.out.println("Decrypted : "+AutoDecryption(enc,key_x)+"\t|Key:"+key_x);

        else
            System.out.println("Decrypted : "+AutoDecryption(enc,key)+"\t|Key:"+key);
    }

    public static String AutoEncryption(String text,String key){
        int len = text.length();

        String subkey = key + text;
        subkey = subkey.substring(0,subkey.length()-key.length());

        String sb = "";
        for(int x=0;x<len;x++){
            int get1 = alpha.indexOf(text.charAt(x));
            int get2 = alpha.indexOf(subkey.charAt(x));

            int total = (get1 + get2)%26;

            sb += alpha.charAt(total);
            //System.out.print(sb+"\n");
        }

        return sb;
    }

    public static String AutoDecryption(String text,String key){
        int len = text.length();

        String current = key;
        String sb ="";

        for(int x=0;x<len;x++){
            int get1 = alpha.indexOf(text.charAt(x));
            int get2 = alpha.indexOf(current.charAt(x));

            int total = (get1 - get2)%26;
            total = (total<0)? total + 26 : total;
            sb += alpha.charAt(total);

            current += alpha.charAt(total);
            //System.out.print(current+"\n");
        }
        return sb;
    }
}
