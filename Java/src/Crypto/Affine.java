package Crypto;

import java.math.BigInteger;

public class Affine {

    private static int firstKey = 3;
    private static int secondKey = 19;
    private static int module = 256;//26

    public static void main(String[] args) {
        //String input = "mynameisdarren";
        String cipher = "38344:1300:19716:3584:57344:25288:32629:43453:40761:40192:41100:54103:19377:47876:17117:622:18021:48441:24949:13056:5041:17269:20281:40192:58591:19965:12398:56832".replaceAll(":","");//encrypt(input);
        String deciphered = decrypt(cipher);
        //System.out.println("Source:    " + input);
        System.out.println("Encrypted: " + cipher);
        System.out.println("Decrypted: " + deciphered);
    }

   /* static String encrypt(String input) {
        StringBuilder builder = new StringBuilder();
        for (int in = 0; in < input.length(); in++) {
            char character = input.charAt(in);
            if (Character.isLetter(character)) {
                character = (char) ((firstKey * (character - 'a') + secondKey) % module + 'a');
            }
            builder.append(character);
        }
        return builder.toString();
    }*/

    static String decrypt(String input) {
        StringBuilder builder = new StringBuilder();
        // compute firstKey^-1 aka "modular inverse"
        BigInteger inverse = BigInteger.valueOf(firstKey).modInverse(BigInteger.valueOf(module));
        // perform actual decryption
        for (int in = 0; in < input.length(); in++) {
            char character = input.charAt(in);
            if (Character.isLetter(character)) {
                int decoded = inverse.intValue() * (character - 'a' - secondKey + module);
                character = (char) (decoded % module + 'a');
            }
            builder.append(character);
        }
        return builder.toString();
    }

}
