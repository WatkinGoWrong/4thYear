package Crypto;

/*
   Autokey encryption and decryption
*/
import java.util.*;
import java.lang.*;

public class Autokey {
    private static String alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

    public static String enc = "    5    10    15    20    25    30    35    40\n" +
            " fhqmw tsgvv ojecw blwel auoyz oltap tmbhi tkjtd\n" +
            "    45    50    55    60    65    70    75    80\n" +
            " fdoue awafd crrpm azlhv rkcjl vmtay avpwi zumfs\n" +
            "    85    90    95   100   105   110   115   120\n" +
            " jvrot nhakm qzfbs waori hewjj rvmfs jvrot nhakm\n" +
            "   125   130   135   140   145   150   155   160\n" +
            " qzfbc qvzga vfmrh bgnpu nbyrt uholm fzign gkqqm\n" +
            "   165   170   175   180   185   190   195   200\n" +
            " wppmg alqul gopsy alqbr zyebi lprvs pueeh kvbqr\n" +
            "   205   210   215   220   225   230   235   240\n" +
            " xlpji secia hapdi tfilu devrv hkffu giejw cnrsg\n" +
            "   245   250   255   260   265   270   275   280\n" +
            " glyzj ijkhm ovyka nziqh ibfye gnigg nyams rxjkg\n" +
            "   285   290   295   300   305   310   315   320\n" +
            " fsqxs rxtlh uybcm ftcqr whvoe ftswj znjll rghsw\n" +
            "   325   330   335   340   345   350   355   360\n" +
            " pxwmy kiqej lipln ybuqb hcguo olkmp ifkrf ugxau\n" +
            "   365   370   375   380   385   390   395   400\n" +
            " vnegf jryfp lsnzv pqara purwa sawqx fcvet pveef\n" +
            "   405   410   415   420   425   430   435   440\n" +
            " innff pzkgu uehxm segax sesta xueze exzwx nziqt\n" +
            "   445   450   455   460   465   470   475   480\n" +
            " aofka vmxvh aogwi fmpwf qqxun ijkyi fqhdp sdgue\n" +
            "   485   490   495   500   505   510   515   520\n" +
            " esxid odwng vpyug ofqft fexkv pspjo bplvj pyuwf\n" +
            "   525   530   535   540   545   550   555   560\n" +
            " wqfrx hbvsn mxulf dvjbq vihzr xhxky cawye gxnav\n" +
            "   565   570   575   580   585   590   595   600\n" +
            " sllwe giyxf ahtbc byfao gnimj znjll rghsw pxwmy\n" +
            "   605   610   615   620   625   630   635   640\n" +
            " kiqej liplg uobxb hwtkx rgmru oolkm pifkr fugxa\n" +
            "   645   650   655   660   665   670   675   680\n" +
            " uvneg fjryf plsno hkvxu lqaao bynxi iwbgx ghiku\n" +
            "   685   690   695   700   705   710   715   720\n" +
            " swvgx nceoy mlpri dffzx nnymh mxmda cxgcw grwfp\n" +
            "   725   730   735   740   745   750   755   760\n" +
            " rfdff zxnny mhmxm dacxr viqbp qiqwh rdkwv woimo\n" +
            "   765   770   775   780   785   790   795   800\n" +
            " icgss jgtol vvvtg ywomx fytqf lelvq ospme sucsi\n" +
            "   805   810   815   820   825   830   835   840\n" +
            " drufi cnysc vikpl hyvvr yvxon tijvn zlvea ewjvr\n" +
            "   845   850   855   860   865   870   875   880\n" +
            " hoimt ezsjs infnt iytaq nnfjz pwhkt tntlw ksmte\n" +
            "   885   890   895   900   905   910   915   920\n" +
            " afgzs xhiwn lxlag fxhye cdvcj xsmai ikvil xrahz\n" +
            "   925   930   935   940   945   950   955   960\n" +
            " vbbgn ydtey cxodt vkmgr ksiya toxac ggoad zmqac\n" +
            "   965   970   975   980   985   990   995  1000\n" +
            " ggoad zmqvv qvsfn zxebu kksag wyfwh ctbbl wrchb\n" +
            "  1005  1010  1015  1020  1025  1030  1035  1040\n" +
            " entwg bfelr nbxqc gaifq ntpbi phvgt wyfwh cdbgg\n" +
            "  1045  1050  1055  1060  1065  1070  1075  1080\n" +
            " olrnb xvczx tzssu fmfys momey vilxr ahzvb bgnyd\n" +
            "  1085  1090  1095  1100  1105  1110  1115  1120\n" +
            " teycx odtvk mmwqt icywe rwpfl cfbwn jtkez vsqmb\n" +
            "  1125  1130  1135  1140  1145  1150  1155  1160\n" +
            " ympfk osbhw aypzu lfpuc nysce mkcpo ohqgj zxgmr\n" +
            "  1165  1170  1175  1180  1185  1190  1195  1200\n" +
            " vyqpz nihol gfxhz oxgal ypghk mienu fwjwg ltgbl\n" +
            "  1205  1210  1215  1220  1225  1230  1235  1240\n" +
            " aupkq rokvq zjkwz ksxjw yhfvn vmqfc zxrve zvaum\n" +
            "  1245  1250  1255  1260  1265  1270  1275  1280\n" +
            " hircv afwyc lhvil xrahz vbbgn ydtey cxodt vkmmw\n" +
            "  1285  1290  1295  1300  1305  1310  1315  1320\n" +
            " qticy werwp flcfb wnjtk ezvsq mbymp fkosb henlo\n" +
            "  1325  1330  1335  1340  1345  1350  1355  1360\n" +
            " rrkrm fktif kophw qimpo hmewr oltlb iezll okaes\n" +
            "  1365  1370  1375  1380  1385  1390  1395  1400\n" +
            " monat ckzgn rlgud szfvh rsoyk gmqbz gdzto jxvbz\n" +
            "  1405  1410  1415  1420  1425  1430  1435  1440\n" +
            " gdzto jxvbz gdzto jxvvg yhsmt lbyup kkzgn rlgud\n" +
            "  1445  1450  1455  1460  1465  1470  1475  1480\n" +
            " scgqk nwtug qoobm ebpvo qxpjk xppvo tilaz hbmus\n" +
            "  1485  1490  1495  1500  1505  1510  1515  1520\n" +
            " ifaec zslba xkliy rrggt snaio unhaj sbtsd cpxzg\n" +
            "  1525  1530  1535  1540  1545  1550  1555  1560\n" +
            " hbpea dvvvr wmwml ssusa mzhvr dfbre xhmnh oarkr\n" +
            "  1565  1570  1575  1580  1585  1590  1595  1600\n" +
            " zemfb dytus daear dftvf bkxux bczpg bkxux bczah\n" +
            "  1605  1610  1615  1620  1625  1630  1635  1640\n" +
            " nerql cgxew lpgna reecm ydbxo lfgwv gibuk xbcji\n" +
            "  1645  1650  1655  1660  1665  1670  1675  1680\n" +
            " zuglw ccxsu jause rgpbr zgkmy mfrfw xcncg xbqlp\n" +
            "  1685  1690  1695  1700  1705  1710  1715  1720\n" +
            " arkve tgggp kkteo myaow xztyp ekyfg yguet jkkls\n" +
            "  1725  1730  1735  1740  1745  1750  1755  1760\n" +
            " ahbxg sunud malpg lvnjh yvyyl zoxhm lvnfk tksha\n" +
            "  1765  1770  1775  1780  1785  1790  1795  1800\n" +
            " pbfhp njohd xpqgu lcaww gnsdq mbtsp etwsw crxvj\n" +
            "  1805  1810  1815  1820  1825  1830  1835  1840\n" +
            " fimsk ampzn plrfg gttyb kxuxb czpgb kxuxb czahx\n" +
            "  1845  1850  1855  1860  1865  1870  1875  1880\n" +
            " egxtt czahl qvras guuxh qzotn aoahw mlvkt jexlo\n" +
            "  1885  1890  1895  1900  1905  1910  1915  1920\n" +
            " wosjn zgrzl kchgh lmlvx amkwq bmilp avvdh zghbp\n" +
            "  1925  1930  1935  1940  1945  1950  1955  1960\n" +
            " eadvv vrwmw mlssu samzh vrdfb rexhm nhoar krzem\n" +
            "  1965  1970  1975  1980  1985  1990  1995  2000\n" +
            " fbdyt usbvo jgcru catjc imfzl pvtwg fsjfe oouhq\n" +
            "  2005  2010  2015  2020  2025  2030  2035  2040\n" +
            " lqfxq bpprb quklu zwxsq rgqtz zbkxu xbczp gbkxu\n" +
            "  2045  2050  2055  2060  2065  2070  2075  2080\n" +
            " xbcza hnerq lcgxe wlpgn areec mjfbx ormtz rwfmf\n" +
            "  2085  2090  2095  2100  2105  2110  2115  2120\n" +
            " tcqew bdhxl usirc zyodt axtka rcoxd malta csrfr\n" +
            "  2125  2130  2135  2140  2145  2150  2155  2160\n" +
            " namch diywo lmwsf hraek vbhkd ozroe vpxfi hbshc\n" +
            "  2165  2170  2175  2180  2185  2190  2195  2200\n" +
            " efsui aphwe uyhmk oecow uwasm zxwpp ywuil amhhg\n" +
            "  2205  2210  2215  2220  2225  2230  2235  2240\n" +
            " pazqk qmaoz iifpa vdiwt pmmfw hnmnt oicsg nomip\n" +
            "  2245  2250  2255  2260  2265  2270  2275  2280\n" +
            " weluf wwmlv ktjex lowos jnzgr zlkch ghlml vxamk\n" +
            "  2285  2290  2295  2300  2305  2310  2315  2320\n" +
            " wquog ejaxu wwimp gmzmq tkvuh ycplv dfimc fdnrg\n" +
            "  2325  2330  2335  2340  2345  2350  2355  2360\n" +
            " jwhgv butrm hqgng vfzle dblvn aeylz oxhcq xrfrn\n" +
            "  2365  2370  2375  2380  2385  2390  2395  2400\n" +
            " amchd iywol mwsfh raekv bhkdo zroev pxfih bshce\n" +
            "  2405  2410  2415  2420  2425  2430  2435  2440\n" +
            " fsuia phwia bhbvy efvoz hmome kojcz kbubu kdvoe\n" +
            "  2445  2450  2455  2460  2465  2470  2475  2480\n" +
            " zwsfh rfsuk tyjut spcgr oevpx fihml rjlam tzgyb\n" +
            "  2485  2490  2495  2500  2505  2510  2515  2520\n" +
            " xgbtv weucf yufoh jkped adghc tucnf elqww azeah\n" +
            "  2525  2530  2535  2540  2545  2550  2555  2560\n" +
            " ehphb oxmni oapqf vvgin kkwuf akspt hvsvg nxbai\n" +
            "  2565  2570  2575  2580  2585  2590  2595  2600\n" +
            " btorx wwpkm qtsrk iztfy kwbuk glzub hvkos bhsos\n" +
            "  2605  2610  2615  2620  2625  2630  2635  2640\n" +
            " mwenc zgpww vajgy tqlia lsxio awami milma wthwp\n" +
            "  2645  2650  2655  2660  2665  2670  2675  2680\n" +
            " tbgsq pnnph baaby tjhmz kzeei azhsh zfglt syiix\n" +
            "  2685  2690  2695  2700  2705  2710  2715  2720\n" +
            " jhxhx nlicp ubvbt qlowv lalsh lyqso ktuhp pxnpe\n" +
            "  2725  2730  2735  2740  2745  2750  2755  2760\n" +
            " jszbx fidir vuati pivbp xjsce ehvpd ffyub bufyn\n" +
            "  2765  2770  2775  2780  2785  2790  2795  2800\n" +
            " pqvhu apuoi ullyx bqdet tasrk iznon iobuk lrzbi\n" +
            "  2805  2810  2815  2820  2825  2830  2835  2840\n" +
            " ltrlc wvqqg ytccq ejizs mjlcv pmtso gvlzh gphez\n" +
            "  2845  2850  2855  2860  2865  2870  2875  2880\n" +
            " jxpgm tmcap zqjpg gdofh qarlg rycud auxkr hyvzo\n" +
            "  2885  2890  2895  2900  2905  2910  2915  2920\n" +
            " zkadc yjzwh fmjga skzik bvgnl tetqv avmzr teaxs\n" +
            "  2925  2930  2935  2940  2945  2950  2955  2960\n" +
            " nmkaj ogtyc hsimw nqbgg zckle nymga zdbum nbjbz\n" +
            "  2965  2970  2975  2980  2985  2990  2995  3000\n" +
            " njbgp rxjgj pgxlw mimla ieivi wbvhe nzewl porbz\n" +
            "  3005  3010  3015  3020  3025  3030  3035  3040\n" +
            " kvwgw esyge phdrv drchu fxfwr ydeom jlcvp mtsog\n" +
            "  3045  3050  3055  3060  3065  3070  3075  3080\n" +
            " vlzhg phezl hyxee ufitq sudao rfnug xosoj jxheh\n" +
            "  3085  3090  3095  3100  3105  3110  3115  3120\n" +
            " ewbsi dnyvw zexmn llivr whlwh olkgh bzewp zmzhb\n" +
            "  3125  3130  3135  3140  3145  3150  3155  3160\n" +
            " fszpz catrq fjtki qafww nqewm lttts qlwfi wphjj\n" +
            "  3165  3170  3175  3180  3185  3190  3195  3200\n" +
            " kryqt lxbqf fmkhr wnzpa dzefp cmjzy qcenz rkqas\n" +
            "  3205  3210  3215  3220  3225  3230  3235  3240\n" +
            " tpejn rjpoc czppf mwfrj yqcun cxgzg jwhvg mddef\n" +
            "  3245  3250  3255  3260  3265  3270  3275  3280\n" +
            " lhgwi tploe shdkx gimwx mstxw rraje vzgyo osoqw\n" +
            "  3285  3290  3295  3300  3305  3310  3315  3320\n" +
            " sijyo eretq cbzjh uxpef lhgwi tploe shdkx gimwf\n" +
            "  3325  3330  3335  3340  3345  3350  3355  3360\n" +
            " jqraa zxtit tcrea wgvxo xtysv erwlj cymmq uxwmg\n" +
            "  3365  3370  3375  3380  3385  3390  3395  3400\n" +
            " vjksu mfmgh nafzb ipgza kxeob srugt cprop hvugn\n" +
            "  3405  3410  3415  3420  3425  3430  3435  3440\n" +
            " xvnew hbsrk ijhtl ucxkm havue tizku qjcpv xeqte\n" +
            "  3445  3450  3455  3460  3465  3470  3475  3480\n" +
            " eccrm xkwia rchdm fgexr fdmsm cemgj huxci xhyqu\n" +
            "  3485  3490  3495  3500  3505  3510  3515  3520\n" +
            " jqrkg vycay wggkg qblfe nkpvr qlfhu flepc eflhg\n" +
            "  3525  3530  3535  3540  3545  3550  3555  3560\n" +
            " witpl oeshd kxgim wxmst xwrra jevzg yooso qwsij\n" +
            "  3565  3570  3575  3580  3585  3590  3595  3600\n" +
            " yoere tqcbz jhuxp eflhg witpl oeshd kxgim wfjqr\n" +
            "  3605  3610  3615  3620  3625  3630  3635  3640\n" +
            " aazca yslcn xkeps hfauc rfmvm fvkov urpxp wtfzl\n" +
            "  3645  3650  3655  3660  3665  3670  3675  3680\n" +
            " hiihy iymrt nafzb ipgza kxeob srugt cqele gcrev\n" +
            "  3685  3690  3695  3700  3705  3710  3715  3720\n" +
            " ztavq lvjjy ziptu hdmlq mrbey swzgz prdcz jlfpx\n" +
            "  3725  3730  3735  3740  3745  3750  3755  3760\n" +
            " ywxvg btbcs elnvu niikc shbvu cdgsj jgceq pbzib\n" +
            "  3765  3770  3775  3780  3785  3790  3795  3800\n" +
            " enmzg eqhlg iblfe nkpvr gubzo glwfv rvyub xrovk\n" +
            "  3805  3810  3815  3820  3825  3830  3835  3840\n" +
            " haxoo irvyc orrov vghqa iqrvy falka wjwal ogtaw\n" +
            "  3845  3850  3855  3860  3865  3870  3875  3880\n" +
            " bjdrz ofmvh vfgda zxiwb xzemm lcxzc itlvx hzgca\n" +
            "  3885  3890  3895  3900  3905  3910  3915  3920\n" +
            " htrcg lbbrv aqrcg xhqcb nygbh phjrr jghyr aktya\n" +
            "  3925  3930  3935  3940  3945  3950  3955  3960\n" +
            " mmfev gfxbl vaewa eoyvi vtudb ktfsp mxjhb twjey\n" +
            "  3965  3970  3975  3980  3985  3990  3995  4000\n" +
            " eemlc akfpq uoevg xzhln cijsq ngked lynuy wbklx\n" +
            "  4005  4010  4015  4020  4025  4030  4035  4040\n" +
            " zykfy ivgas voefm wbuxq kcdwz jgksp aocrn ycrie\n" +
            "  4045  4050  4055  4060  4065  4070  4075  4080\n" +
            " uuuwa mvsns jujmv taxhv znkei umzsn kvvnl iokvx\n" +
            "  4085  4090  4095  4100  4105  4110  4115  4120\n" +
            " cijgu bepcm xhdbt ftprw rfnin ltrmf dapsn gzzyk\n" +
            "  4125  4130  4135  4140  4145  4150  4155  4160\n" +
            " uzaag uvhwk sxbwq zldrx rufiv mpohk lgnyd eramx\n" +
            "  4165  4170  4175  4180  4185  4190  4195  4200\n" +
            " zsrie zjxbn ztrmm vmbuc yapvb uszzt zzttt bcjbr\n" +
            "  4205  4210  4215  4220  4225  4230  4235  4240\n" +
            " buatd saeuk zgine kseuk ksjei nsvgn xffel lvuxy\n" +
            "  4245  4250  4255  4260  4265  4270  4275  4280\n" +
            " irght wruhk sueoi kmlkt bxypx zywsi tkpvb uszzt\n" +
            "  4285  4290  4295  4300  4305  4310  4315  4320\n" +
            " zzttt bcjbr buatd saeuk zgine kseuk nmbhy ezqtn\n" +
            "  4325  4330  4335  4340  4345  4350  4355  4360\n" +
            " pvbus zztzz tttbc jbrbu atdsa eukzg ineks cvmek\n" +
            "  4365  4370  4375  4380  4385  4390  4395  4400\n" +
            " goghs zhmer mcepy muicz kgvsy ijrrw oytzm covtv\n" +
            "  4405  4410  4415  4420  4425  4430  4435  4440\n" +
            " gsiob rxeun hfhxm mdaps lelii qzkqk ytzmc ovtag\n" +
            "  4445  4450  4455  4460  4465  4470  4475  4480\n" +
            " rqabg nwfwv piarx fsdmk wpzmt jidib lwehn zydlb\n" +
            "  4485  4490  4495  4500  4505  4510  4515  4520\n" +
            " blftq hycek irbil aslmd agazu bhqxg nhazu mcqwd\n" +
            "  4525  4530  4535  4540  4545  4550  4555  4560\n" +
            " nzeml ujlwr ofzwg pstep ssfmf qswgy xcfjv rpfkz\n" +
            "  4565  4570  4575  4580  4585  4590  4595  4600\n" +
            " tckwe hnzyj dpxhm lyfyk kvsnx qtymg nwhul rlhdr\n" +
            "  4605  4610  4615  4620  4625  4630  4635  4640\n" +
            " egnjo fwoif ypskb ayfqs ebkaj swrqc mvqgq voifm\n" +
            "  4645  4650  4655  4660  4665  4670  4675  4680\n" +
            " mcejc fdmnf vftdu spspg cmlmk ssfya pgwzc fskmk\n" +
            "  4685  4690  4695  4700  4705  4710  4715  4720\n" +
            " iqspg cmlmk ssfya pgwzc fskmk iqspg cmlmk ssfya\n" +
            "  4725  4730  4735  4740  4745  4750  4755  4760\n" +
            " pgwzc fskmk iqspg cmlmk ssfya pghim dfvxp cschv\n" +
            "  4765  4770  4775  4780  4785  4790  4795  4800\n" +
            " xoimy cnvjo bxrwl vamga anuhg fiirl wxvtn sovps\n" +
            "  4805  4810  4815  4820  4825  4830  4835  4840\n" +
            " chvxo imyci eopmv ygkiz epixz nuhgf iirlj htiqb\n" +
            "  4845  4850  4855  4860  4865  4870  4875  4880\n" +
            " cmuwv vqpci lzvyg kicbz ekznu hgfii rljht iqbcm\n" +
            "  4885  4890  4895  4900  4905  4910  4915  4920\n" +
            " uwvvq pcilz vygki cbzek znuhg fiirl obkmp uavfe\n" +
            "  4925  4930  4935  4940  4945  4950  4955  4960\n" +
            " fwxzo xtkvq pgoee vfgle kznuh gfiir ljhti qbcmu\n" +
            "  4965  4970  4975  4980  4985  4990  4995  5000\n" +
            " wvvqp cilzv ygkic bzekz nuhgf iirlw xvtns neplw\n" +
            "  5005  5010  5015  5020  5025  5030  5035  5040\n" +
            " ehnzy dlbbl ftqhy cekir bilas lmdag azubh qxgnh\n" +
            "  5045  5050  5055  5060  5065  5070  5075  5080\n" +
            " azumc qwdnz emluj lwrof zwgps tepss fmfqs wgyxc\n" +
            "  5085  5090  5095  5100  5105  5110  5115  5120\n" +
            " fmtdr yevnv jgpst epssf mfqsw gyxcf mtdry evnvj\n" +
            "  5125  5130  5135  5140  5145  5150  5155  5160\n" +
            " gpste pssfm fqswg yxcfh fzhyx llxyr gqumk wseym\n" +
            "  5165  5170  5175  5180  5185  5190  5195  5200\n" +
            " ybgvh ohpim yaara kvrzx ktsvu uvgvh ohpim yaarg\n" +
            "  5205  5210  5215  5220  5225  5230  5235  5240\n" +
            " qumkw seymy bgvho hpimy aarak vrzxk tsvuu vgjnl\n" +
            "  5245  5250  5255  5260  5265  5270  5275  5280\n" +
            " egvze abnyr spgcm lmkss fyapg wzcfs kmkiq spgcm\n" +
            "  5285  5290  5295  5300  5305  5310  5315  5320\n" +
            " lmkss fyapg wzcfs kmkiq spgcm lmkss fyapg wzcfs\n" +
            "  5325  5330  5335  5340  5345  5350  5355  5360\n" +
            " kmkiq spgcm lmkss fyapg wzcfs kmkiq spgcm lmkss\n" +
            "  5365  5370  5375  5380  5385  5390  5395  5400\n" +
            " fyapg wzcfs kmkiq spgcm lmkss fyapg wzcfs kmkiq\n" +
            "  5405  5410  5415  5420  5425  5430  5435  5440\n" +
            " spgcm lmkss fyapg apgyy klctw inmsr moiqe cmwmn\n" +
            "  5445  5450  5455  5460  5465  5470  5475  5480\n" +
            " mphpn vrsze mwgfv oliys ghkrd zxwvd rtrix egksi\n" +
            "  5485  5490  5495  5500  5505  5510  5515  5520\n" +
            " ghdpg cbqnm tflph gohqb tyfnd plnvt gecry qlmaw\n" +
            "  5525  5530  5535  5540  5545  5550  5555  5560\n" +
            " cxgqc xlaat lzrpp aegdm nbedn ztksm nbxgy rrvzb\n" +
            "  5565  5570  5575  5580  5585  5590  5595  5600\n" +
            " ukwfe vvukl lewkp zpzyz xnbgn fztzt tqmrt pirat\n" +
            "  5605  5610  5615  5620  5625  5630  5635  5640\n" +
            " edxxb ayraa lelmf qieux uismy csnsj ritts gqyun\n" +
            "  5645  5650  5655  5660  5665  5670  5675  5680\n" +
            " ihbne pgrlo lwqix iirvr ltzim okxbo vimru lcaco\n" +
            "  5685  5690  5695  5700  5705  5710  5715  5720\n" +
            " vtdjq grlpp iytje zimok mytoe kumck inmsr moiqe\n" +
            "  5725  5730  5735  5740  5745  5750  5755  5760\n" +
            " cmwmn mphpn vrsze mwgfv oliys ghkrd zxwvd rtrix\n" +
            "  5765  5770  5775  5780  5785  5790  5795  5800\n" +
            " egksi ghdpg cbqnm tflph gofvv vbamg mnepg rlolw\n" +
            "  5805  5810  5815  5820  5825  5830  5835  5840\n" +
            " qixii rvrlt zimok xbovi mrulc acovt djqgr lppiy\n" +
            "  5845  5850  5855\n" +
            " tjezi moklb h ";

    public static void main(String[] args) {

        String[] alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

        //public String text = "THISISTHEWAYBACKHOME";

        String key = "F";  //FUNERALCDI
        int charPos = 1;
        int startpos = 0;

        if (key.matches("[-+]?\\d*\\.?\\d+"))
            key = "" + alpha.charAt(Integer.parseInt(key));

        //String enc = AutoEncryption(text,key);
        //String enc = "QNXEPKMAEGKLAAELDTPDLHN"; //QUEEN

        enc = enc.replaceAll("\\d", "").replaceAll(" ", "").replaceAll("\\t", "").replaceAll("\\n", "").toUpperCase();

        KEY_LENGTH(enc);

        System.out.println();
        //System.out.println("Encrypted : " + enc);

        if (key.length() < 2)
            for (String key_x : alphabet)
                System.out.println("Decrypted : " + AutoDecryption(enc, key_x, charPos, startpos) + "\nKey:" + key_x + "\n");

        else
            System.out.println("Decrypted : " + AutoDecryption(enc, key, charPos, startpos) + "\nKey:" + key + "\n");

    }

    public static String AutoEncryption(String text, String key) {
        int len = text.length();

        String subkey = key + text;
        subkey = subkey.substring(0, subkey.length() - key.length());

        String sb = "";
        for (int x = 0; x < len; x++) {
            int get1 = alpha.indexOf(text.charAt(x));
            int get2 = alpha.indexOf(subkey.charAt(x));

            int total = (get1 + get2) % 26;

            sb += alpha.charAt(total);
            //System.out.print(sb+"\n");
        }

        return sb;
    }

    public static String AutoDecryption(String text, String key, int charPos, int startpos) {

        String current = key;
        String sb = "";
        String vv = "";
        text = enc_chars(text, charPos, startpos);
        //System.out.println("Encrypted : " + text);

        int len = text.length();

        for (int x = 0; x < len; x++) {
            int get1 = alpha.indexOf(text.charAt(x));
            int get2 = alpha.indexOf(current.charAt(x));

            int total = (get1 - get2) % 26;
            //System.out.println(text.charAt(x) + " - " + current.charAt(x) + " = "+ alpha.indexOf(total));
            //System.out.println(get1 + " - " + get2 + " = "+ total);
            total = (total < 0) ? total + 26 : total;
            sb += alpha.charAt(total);

            current += alpha.charAt(total);

        }

        double[] freq = LetterFreq(sb);

        for (char z : alpha.toCharArray()) {
            System.out.print(z + ":" + freq[alpha.indexOf(z)] + "|");
        }

        System.out.println("\nETAONISRH: %" + ((freq[alpha.indexOf('E')] + freq[alpha.indexOf('T')] + freq[alpha.indexOf('A')] + freq[alpha.indexOf('O')] + freq[alpha.indexOf('N')] + freq[alpha.indexOf('I')] + freq[alpha.indexOf('S')] + freq[alpha.indexOf('R')] + freq[alpha.indexOf('H')]) / len) * 100);
        //System.out.println("\nETAONISRH: %"+((freq[alpha.indexOf('E')]+freq[alpha.indexOf('T')]+freq[alpha.indexOf('A')]+freq[alpha.indexOf('O')]+freq[alpha.indexOf('N')]+freq[alpha.indexOf('I')]+freq[alpha.indexOf('S')]+freq[alpha.indexOf('R')]+freq[alpha.indexOf('H')])+"/"+len)+"*"+100);
        System.out.println("ETAON: %" + ((freq[alpha.indexOf('E')] + freq[alpha.indexOf('T')] + freq[alpha.indexOf('A')] + freq[alpha.indexOf('O')] + freq[alpha.indexOf('N')]) / len) * 100);
        System.out.println("LNRST: %" + ((freq[alpha.indexOf('L')] + freq[alpha.indexOf('N')] + freq[alpha.indexOf('R')] + freq[alpha.indexOf('S')] + freq[alpha.indexOf('T')]) / len) * 100);
        System.out.println("AEIOU: %" + ((freq[alpha.indexOf('A')] + freq[alpha.indexOf('E')] + freq[alpha.indexOf('I')] + freq[alpha.indexOf('O')] + freq[alpha.indexOf('U')]) / len) * 100);
        System.out.println("JKQXZ: %" + ((freq[alpha.indexOf('J')] + freq[alpha.indexOf('K')] + freq[alpha.indexOf('Q')] + freq[alpha.indexOf('X')] + freq[alpha.indexOf('Z')]) / len) * 100);

        return sb;
    }


    public static double[] LetterFreq(String s) {

        char[] x = s.toUpperCase().toCharArray();
        double[] bet = new double[26];
        for (char cur : x) {
            bet[alpha.indexOf(cur)]++;
        }
        return bet;
    }

    public static String enc_chars(String s, int charPos, int startpos) {
        String title = "";
        for (int i = 0; i < s.length(); i += charPos) {
            if (i + startpos < s.length()) title += s.charAt(i + startpos);
        }
        return title;
    }


    public static int KEY_LENGTH(String s) {
        int key = 1;
        int key_pos = 1;
        int[] freq = new int[s.length()];

        for(int start_Char=0;start_Char<s.length()-1;start_Char++){
            for(int comp_Char=start_Char+1;comp_Char<s.length();comp_Char++){
                if(s.charAt(start_Char)==s.charAt(comp_Char)){
                    freq[comp_Char-start_Char]++;
                }
            }

        }

        for(int x = 0;x<freq.length;x++){
            if(freq[x]!=0){
                if(freq[x]>key){
                    key=freq[x];
                    key_pos=x;
                    System.out.print(key_pos+":"+key+" | ");
                }
            }
        }
        return key;
    }
}
