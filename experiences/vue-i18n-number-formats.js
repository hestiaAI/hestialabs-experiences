// https://kazupon.github.io/vue-i18n/guide/number.html
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#options

const numberFormatsArray = [
  ['ca-AD', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ar-AE', { currency: { style: 'currency', currency: 'AED' } }],
  ['en-AE', { currency: { style: 'currency', currency: 'AED' } }],
  ['fa-AF', { currency: { style: 'currency', currency: 'AFN' } }],
  ['ps-AF', { currency: { style: 'currency', currency: 'AFN' } }],
  ['uz-Arab-AF', { currency: { style: 'currency', currency: 'AFN' } }],
  ['en-AG', { currency: { style: 'currency', currency: 'XCD' } }],
  ['en-AI', { currency: { style: 'currency', currency: 'XCD' } }],
  ['sq-AL', { currency: { style: 'currency', currency: 'ALL' } }],
  ['hy-AM', { currency: { style: 'currency', currency: 'AMD' } }],
  ['ln-AO', { currency: { style: 'currency', currency: 'AOA' } }],
  ['pt-AO', { currency: { style: 'currency', currency: 'AOA' } }],
  ['es-AR', { currency: { style: 'currency', currency: 'ARS' } }],
  ['en-AS', { currency: { style: 'currency', currency: 'USD' } }],
  ['de-AT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-AT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-AU', { currency: { style: 'currency', currency: 'AUD' } }],
  ['nl-AW', { currency: { style: 'currency', currency: 'AWG' } }],
  ['sv-AX', { currency: { style: 'currency', currency: 'EUR' } }],
  ['az-Cyrl-AZ', { currency: { style: 'currency', currency: 'AZN' } }],
  ['az-Latn-AZ', { currency: { style: 'currency', currency: 'AZN' } }],
  ['bs-Cyrl-BA', { currency: { style: 'currency', currency: 'BAM' } }],
  ['bs-Latn-BA', { currency: { style: 'currency', currency: 'BAM' } }],
  ['hr-BA', { currency: { style: 'currency', currency: 'BAM' } }],
  ['sr-Cyrl-BA', { currency: { style: 'currency', currency: 'BAM' } }],
  ['sr-Latn-BA', { currency: { style: 'currency', currency: 'BAM' } }],
  ['en-BB', { currency: { style: 'currency', currency: 'BBD' } }],
  ['bn-BD', { currency: { style: 'currency', currency: 'BDT' } }],
  ['ccp-BD', { currency: { style: 'currency', currency: 'BDT' } }],
  ['de-BE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-BE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fr-BE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['nl-BE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ff-Adlm-BF', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ff-Latn-BF', { currency: { style: 'currency', currency: 'XOF' } }],
  ['fr-BF', { currency: { style: 'currency', currency: 'XOF' } }],
  ['bg-BG', { currency: { style: 'currency', currency: 'BGN' } }],
  ['ar-BH', { currency: { style: 'currency', currency: 'BHD' } }],
  ['en-BI', { currency: { style: 'currency', currency: 'BIF' } }],
  ['fr-BI', { currency: { style: 'currency', currency: 'BIF' } }],
  ['rn-BI', { currency: { style: 'currency', currency: 'BIF' } }],
  ['fr-BJ', { currency: { style: 'currency', currency: 'XOF' } }],
  ['yo-BJ', { currency: { style: 'currency', currency: 'XOF' } }],
  ['fr-BL', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-BM', { currency: { style: 'currency', currency: 'BMD' } }],
  ['ms-BN', { currency: { style: 'currency', currency: 'BND' } }],
  ['es-BO', { currency: { style: 'currency', currency: 'BOB' } }],
  ['qu-BO', { currency: { style: 'currency', currency: 'BOB' } }],
  ['es-BR', { currency: { style: 'currency', currency: 'BRL' } }],
  ['pt-BR', { currency: { style: 'currency', currency: 'BRL' } }],
  ['en-BS', { currency: { style: 'currency', currency: 'BSD' } }],
  ['dz-BT', { currency: { style: 'currency', currency: 'INR' } }],
  ['en-BW', { currency: { style: 'currency', currency: 'BWP' } }],
  ['be-BY', { currency: { style: 'currency', currency: 'BYN' } }],
  ['ru-BY', { currency: { style: 'currency', currency: 'BYN' } }],
  ['en-BZ', { currency: { style: 'currency', currency: 'BZD' } }],
  ['es-BZ', { currency: { style: 'currency', currency: 'BZD' } }],
  ['en-CA', { currency: { style: 'currency', currency: 'CAD' } }],
  ['fr-CA', { currency: { style: 'currency', currency: 'CAD' } }],
  ['en-CC', { currency: { style: 'currency', currency: 'AUD' } }],
  ['fr-CD', { currency: { style: 'currency', currency: 'CDF' } }],
  ['ln-CD', { currency: { style: 'currency', currency: 'CDF' } }],
  ['lu-CD', { currency: { style: 'currency', currency: 'CDF' } }],
  ['sw-CD', { currency: { style: 'currency', currency: 'CDF' } }],
  ['fr-CF', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ln-CF', { currency: { style: 'currency', currency: 'XAF' } }],
  ['sg-CF', { currency: { style: 'currency', currency: 'XAF' } }],
  ['fr-CG', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ln-CG', { currency: { style: 'currency', currency: 'XAF' } }],
  ['de-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['en-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['fr-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['gsw-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['it-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['pt-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['rm-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['wae-CH', { currency: { style: 'currency', currency: 'CHF' } }],
  ['fr-CI', { currency: { style: 'currency', currency: 'XOF' } }],
  ['en-CK', { currency: { style: 'currency', currency: 'NZD' } }],
  ['es-CL', { currency: { style: 'currency', currency: 'CLP' } }],
  ['agq-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['bas-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['dua-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['en-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ewo-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ff-Adlm-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ff-Latn-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['fr-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['jgo-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['kkj-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ksf-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['mgo-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['mua-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['nmg-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['nnh-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['yav-CM', { currency: { style: 'currency', currency: 'XAF' } }],
  ['bo-CN', { currency: { style: 'currency', currency: 'CNY' } }],
  ['ii-CN', { currency: { style: 'currency', currency: 'CNY' } }],
  ['ug-CN', { currency: { style: 'currency', currency: 'CNY' } }],
  ['yue-Hans-CN', { currency: { style: 'currency', currency: 'CNY' } }],
  ['zh-Hans-CN', { currency: { style: 'currency', currency: 'CNY' } }],
  ['es-CO', { currency: { style: 'currency', currency: 'COP' } }],
  ['es-CR', { currency: { style: 'currency', currency: 'CRC' } }],
  ['es-CU', { currency: { style: 'currency', currency: 'CUP' } }],
  ['kea-CV', { currency: { style: 'currency', currency: 'CVE' } }],
  ['pt-CV', { currency: { style: 'currency', currency: 'CVE' } }],
  ['nl-CW', { currency: { style: 'currency', currency: 'ANG' } }],
  ['el-CY', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-CY', { currency: { style: 'currency', currency: 'EUR' } }],
  ['tr-CY', { currency: { style: 'currency', currency: 'EUR' } }],
  ['cs-CZ', { currency: { style: 'currency', currency: 'CZK' } }],
  ['de-DE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['dsb-DE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-DE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['hsb-DE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ksh-DE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['nds-DE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ar-DJ', { currency: { style: 'currency', currency: 'DJF' } }],
  ['fr-DJ', { currency: { style: 'currency', currency: 'DJF' } }],
  ['so-DJ', { currency: { style: 'currency', currency: 'DJF' } }],
  ['da-DK', { currency: { style: 'currency', currency: 'DKK' } }],
  ['en-DK', { currency: { style: 'currency', currency: 'DKK' } }],
  ['fo-DK', { currency: { style: 'currency', currency: 'DKK' } }],
  ['en-DM', { currency: { style: 'currency', currency: 'XCD' } }],
  ['es-DO', { currency: { style: 'currency', currency: 'DOP' } }],
  ['ar-DZ', { currency: { style: 'currency', currency: 'DZD' } }],
  ['fr-DZ', { currency: { style: 'currency', currency: 'DZD' } }],
  ['kab-DZ', { currency: { style: 'currency', currency: 'DZD' } }],
  ['es-EC', { currency: { style: 'currency', currency: 'USD' } }],
  ['qu-EC', { currency: { style: 'currency', currency: 'USD' } }],
  ['et-EE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ar-EG', { currency: { style: 'currency', currency: 'EGP' } }],
  ['ar-EH', { currency: { style: 'currency', currency: 'MAD' } }],
  ['ar-ER', { currency: { style: 'currency', currency: 'ERN' } }],
  ['en-ER', { currency: { style: 'currency', currency: 'ERN' } }],
  ['ti-ER', { currency: { style: 'currency', currency: 'ERN' } }],
  ['ast-ES', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ca-ES', { currency: { style: 'currency', currency: 'EUR' } }],
  ['es-ES', { currency: { style: 'currency', currency: 'EUR' } }],
  ['eu-ES', { currency: { style: 'currency', currency: 'EUR' } }],
  ['gl-ES', { currency: { style: 'currency', currency: 'EUR' } }],
  ['am-ET', { currency: { style: 'currency', currency: 'ETB' } }],
  ['om-ET', { currency: { style: 'currency', currency: 'ETB' } }],
  ['so-ET', { currency: { style: 'currency', currency: 'ETB' } }],
  ['ti-ET', { currency: { style: 'currency', currency: 'ETB' } }],
  ['en-FI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fi-FI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['se-FI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['smn-FI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['sv-FI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-FJ', { currency: { style: 'currency', currency: 'FJD' } }],
  ['en-FK', { currency: { style: 'currency', currency: 'FKP' } }],
  ['en-FM', { currency: { style: 'currency', currency: 'USD' } }],
  ['fo-FO', { currency: { style: 'currency', currency: 'DKK' } }],
  ['br-FR', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ca-FR', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fr-FR', { currency: { style: 'currency', currency: 'EUR' } }],
  ['gsw-FR', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fr-GA', { currency: { style: 'currency', currency: 'XAF' } }],
  ['cy-GB', { currency: { style: 'currency', currency: 'GBP' } }],
  ['en-GB', { currency: { style: 'currency', currency: 'GBP' } }],
  ['ga-GB', { currency: { style: 'currency', currency: 'GBP' } }],
  ['gd-GB', { currency: { style: 'currency', currency: 'GBP' } }],
  ['kw-GB', { currency: { style: 'currency', currency: 'GBP' } }],
  ['en-GD', { currency: { style: 'currency', currency: 'XCD' } }],
  ['ka-GE', { currency: { style: 'currency', currency: 'GEL' } }],
  ['os-GE', { currency: { style: 'currency', currency: 'GEL' } }],
  ['fr-GF', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-GG', { currency: { style: 'currency', currency: 'GBP' } }],
  ['ak-GH', { currency: { style: 'currency', currency: 'GHS' } }],
  ['ee-GH', { currency: { style: 'currency', currency: 'GHS' } }],
  ['en-GH', { currency: { style: 'currency', currency: 'GHS' } }],
  ['ff-Adlm-GH', { currency: { style: 'currency', currency: 'GHS' } }],
  ['ff-Latn-GH', { currency: { style: 'currency', currency: 'GHS' } }],
  ['ha-GH', { currency: { style: 'currency', currency: 'GHS' } }],
  ['en-GI', { currency: { style: 'currency', currency: 'GIP' } }],
  ['da-GL', { currency: { style: 'currency', currency: 'DKK' } }],
  ['kl-GL', { currency: { style: 'currency', currency: 'DKK' } }],
  ['en-GM', { currency: { style: 'currency', currency: 'GMD' } }],
  ['ff-Adlm-GM', { currency: { style: 'currency', currency: 'GMD' } }],
  ['ff-Latn-GM', { currency: { style: 'currency', currency: 'GMD' } }],
  ['ff-Adlm-GN', { currency: { style: 'currency', currency: 'GNF' } }],
  ['ff-Latn-GN', { currency: { style: 'currency', currency: 'GNF' } }],
  ['fr-GN', { currency: { style: 'currency', currency: 'GNF' } }],
  ['fr-GP', { currency: { style: 'currency', currency: 'EUR' } }],
  ['es-GQ', { currency: { style: 'currency', currency: 'XAF' } }],
  ['fr-GQ', { currency: { style: 'currency', currency: 'XAF' } }],
  ['pt-GQ', { currency: { style: 'currency', currency: 'XAF' } }],
  ['el-GR', { currency: { style: 'currency', currency: 'EUR' } }],
  ['es-GT', { currency: { style: 'currency', currency: 'GTQ' } }],
  ['en-GU', { currency: { style: 'currency', currency: 'USD' } }],
  ['ff-Adlm-GW', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ff-Latn-GW', { currency: { style: 'currency', currency: 'XOF' } }],
  ['pt-GW', { currency: { style: 'currency', currency: 'XOF' } }],
  ['en-GY', { currency: { style: 'currency', currency: 'GYD' } }],
  ['en-HK', { currency: { style: 'currency', currency: 'HKD' } }],
  ['yue-Hant-HK', { currency: { style: 'currency', currency: 'HKD' } }],
  ['zh-Hans-HK', { currency: { style: 'currency', currency: 'HKD' } }],
  ['zh-Hant-HK', { currency: { style: 'currency', currency: 'HKD' } }],
  ['es-HN', { currency: { style: 'currency', currency: 'HNL' } }],
  ['hr-HR', { currency: { style: 'currency', currency: 'HRK' } }],
  ['fr-HT', { currency: { style: 'currency', currency: 'HTG' } }],
  ['hu-HU', { currency: { style: 'currency', currency: 'HUF' } }],
  ['es-IC', { currency: { style: 'currency', currency: 'EUR' } }],
  ['id-ID', { currency: { style: 'currency', currency: 'IDR' } }],
  ['jv-ID', { currency: { style: 'currency', currency: 'IDR' } }],
  ['ms-ID', { currency: { style: 'currency', currency: 'IDR' } }],
  ['su-Latn-ID', { currency: { style: 'currency', currency: 'IDR' } }],
  ['ar-IL', { currency: { style: 'currency', currency: 'ILS' } }],
  ['en-IL', { currency: { style: 'currency', currency: 'ILS' } }],
  ['he-IL', { currency: { style: 'currency', currency: 'ILS' } }],
  ['en-IM', { currency: { style: 'currency', currency: 'GBP' } }],
  ['gv-IM', { currency: { style: 'currency', currency: 'GBP' } }],
  ['as-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['bn-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['bo-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['brx-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['ccp-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['en-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['gu-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['hi-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['kn-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['kok-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['ks-Arab-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['mai-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['ml-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['mni-Beng-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['mr-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['ne-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['or-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['pa-Guru-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['sat-Olck-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['sd-Deva-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['ta-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['te-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['ur-IN', { currency: { style: 'currency', currency: 'INR' } }],
  ['en-IO', { currency: { style: 'currency', currency: 'USD' } }],
  ['ar-IQ', { currency: { style: 'currency', currency: 'IQD' } }],
  ['ckb-IQ', { currency: { style: 'currency', currency: 'IQD' } }],
  ['lrc-IQ', { currency: { style: 'currency', currency: 'IQD' } }],
  ['ckb-IR', { currency: { style: 'currency', currency: 'IRR' } }],
  ['fa-IR', { currency: { style: 'currency', currency: 'IRR' } }],
  ['lrc-IR', { currency: { style: 'currency', currency: 'IRR' } }],
  ['mzn-IR', { currency: { style: 'currency', currency: 'IRR' } }],
  ['is-IS', { currency: { style: 'currency', currency: 'ISK' } }],
  ['ca-IT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['de-IT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fur-IT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['it-IT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-JE', { currency: { style: 'currency', currency: 'GBP' } }],
  ['en-JM', { currency: { style: 'currency', currency: 'JMD' } }],
  ['ar-JO', { currency: { style: 'currency', currency: 'JOD' } }],
  ['ja-JP', { currency: { style: 'currency', currency: 'JPY' } }],
  ['dav-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['ebu-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['en-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['guz-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['kam-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['ki-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['kln-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['luo-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['luy-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['mas-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['mer-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['om-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['saq-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['so-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['sw-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['teo-KE', { currency: { style: 'currency', currency: 'KES' } }],
  ['ky-KG', { currency: { style: 'currency', currency: 'KGS' } }],
  ['ru-KG', { currency: { style: 'currency', currency: 'KGS' } }],
  ['km-KH', { currency: { style: 'currency', currency: 'KHR' } }],
  ['en-KI', { currency: { style: 'currency', currency: 'AUD' } }],
  ['ar-KM', { currency: { style: 'currency', currency: 'KMF' } }],
  ['fr-KM', { currency: { style: 'currency', currency: 'KMF' } }],
  ['en-KN', { currency: { style: 'currency', currency: 'XCD' } }],
  ['ko-KP', { currency: { style: 'currency', currency: 'KPW' } }],
  ['ko-KR', { currency: { style: 'currency', currency: 'KRW' } }],
  ['ar-KW', { currency: { style: 'currency', currency: 'KWD' } }],
  ['en-KY', { currency: { style: 'currency', currency: 'KYD' } }],
  ['kk-KZ', { currency: { style: 'currency', currency: 'KZT' } }],
  ['ru-KZ', { currency: { style: 'currency', currency: 'KZT' } }],
  ['lo-LA', { currency: { style: 'currency', currency: 'LAK' } }],
  ['ar-LB', { currency: { style: 'currency', currency: 'LBP' } }],
  ['en-LC', { currency: { style: 'currency', currency: 'XCD' } }],
  ['de-LI', { currency: { style: 'currency', currency: 'CHF' } }],
  ['gsw-LI', { currency: { style: 'currency', currency: 'CHF' } }],
  ['en-LR', { currency: { style: 'currency', currency: 'LRD' } }],
  ['ff-Adlm-LR', { currency: { style: 'currency', currency: 'LRD' } }],
  ['ff-Latn-LR', { currency: { style: 'currency', currency: 'LRD' } }],
  ['vai-Latn-LR', { currency: { style: 'currency', currency: 'LRD' } }],
  ['vai-Vaii-LR', { currency: { style: 'currency', currency: 'LRD' } }],
  ['en-LS', { currency: { style: 'currency', currency: 'LSL' } }],
  ['lt-LT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['de-LU', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fr-LU', { currency: { style: 'currency', currency: 'EUR' } }],
  ['lb-LU', { currency: { style: 'currency', currency: 'EUR' } }],
  ['pt-LU', { currency: { style: 'currency', currency: 'EUR' } }],
  ['lv-LV', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ar-LY', { currency: { style: 'currency', currency: 'LYD' } }],
  ['ar-MA', { currency: { style: 'currency', currency: 'MAD' } }],
  ['fr-MA', { currency: { style: 'currency', currency: 'MAD' } }],
  ['shi-Latn-MA', { currency: { style: 'currency', currency: 'MAD' } }],
  ['shi-Tfng-MA', { currency: { style: 'currency', currency: 'MAD' } }],
  ['tzm-MA', { currency: { style: 'currency', currency: 'MAD' } }],
  ['zgh-MA', { currency: { style: 'currency', currency: 'MAD' } }],
  ['fr-MC', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ro-MD', { currency: { style: 'currency', currency: 'MDL' } }],
  ['ru-MD', { currency: { style: 'currency', currency: 'MDL' } }],
  ['sr-Cyrl-ME', { currency: { style: 'currency', currency: 'EUR' } }],
  ['sr-Latn-ME', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fr-MF', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-MG', { currency: { style: 'currency', currency: 'MGA' } }],
  ['fr-MG', { currency: { style: 'currency', currency: 'MGA' } }],
  ['mg-MG', { currency: { style: 'currency', currency: 'MGA' } }],
  ['en-MH', { currency: { style: 'currency', currency: 'USD' } }],
  ['mk-MK', { currency: { style: 'currency', currency: 'MKD' } }],
  ['sq-MK', { currency: { style: 'currency', currency: 'MKD' } }],
  ['bm-ML', { currency: { style: 'currency', currency: 'XOF' } }],
  ['fr-ML', { currency: { style: 'currency', currency: 'XOF' } }],
  ['khq-ML', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ses-ML', { currency: { style: 'currency', currency: 'XOF' } }],
  ['my-MM', { currency: { style: 'currency', currency: 'MMK' } }],
  ['mn-MN', { currency: { style: 'currency', currency: 'MNT' } }],
  ['en-MP', { currency: { style: 'currency', currency: 'USD' } }],
  ['fr-MQ', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ar-MR', { currency: { style: 'currency', currency: 'MRU' } }],
  ['ff-Adlm-MR', { currency: { style: 'currency', currency: 'MRU' } }],
  ['ff-Latn-MR', { currency: { style: 'currency', currency: 'MRU' } }],
  ['fr-MR', { currency: { style: 'currency', currency: 'MRU' } }],
  ['en-MS', { currency: { style: 'currency', currency: 'XCD' } }],
  ['en-MT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['mt-MT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-MW', { currency: { style: 'currency', currency: 'MWK' } }],
  ['es-MX', { currency: { style: 'currency', currency: 'MXN' } }],
  ['en-MY', { currency: { style: 'currency', currency: 'MYR' } }],
  ['ms-MY', { currency: { style: 'currency', currency: 'MYR' } }],
  ['ta-MY', { currency: { style: 'currency', currency: 'MYR' } }],
  ['mgh-MZ', { currency: { style: 'currency', currency: 'MZN' } }],
  ['pt-MZ', { currency: { style: 'currency', currency: 'MZN' } }],
  ['seh-MZ', { currency: { style: 'currency', currency: 'MZN' } }],
  ['af-NA', { currency: { style: 'currency', currency: 'NAD' } }],
  ['en-NA', { currency: { style: 'currency', currency: 'NAD' } }],
  ['naq-NA', { currency: { style: 'currency', currency: 'NAD' } }],
  ['fr-NC', { currency: { style: 'currency', currency: 'XPF' } }],
  ['dje-NE', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ff-Adlm-NE', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ff-Latn-NE', { currency: { style: 'currency', currency: 'XOF' } }],
  ['fr-NE', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ha-NE', { currency: { style: 'currency', currency: 'XOF' } }],
  ['twq-NE', { currency: { style: 'currency', currency: 'XOF' } }],
  ['en-NF', { currency: { style: 'currency', currency: 'AUD' } }],
  ['en-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['ff-Adlm-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['ff-Latn-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['ha-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['ig-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['pcm-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['yo-NG', { currency: { style: 'currency', currency: 'NGN' } }],
  ['es-NI', { currency: { style: 'currency', currency: 'NIO' } }],
  ['en-NL', { currency: { style: 'currency', currency: 'EUR' } }],
  ['fy-NL', { currency: { style: 'currency', currency: 'EUR' } }],
  ['nds-NL', { currency: { style: 'currency', currency: 'EUR' } }],
  ['nl-NL', { currency: { style: 'currency', currency: 'EUR' } }],
  ['nb-NO', { currency: { style: 'currency', currency: 'NOK' } }],
  ['nn-NO', { currency: { style: 'currency', currency: 'NOK' } }],
  ['se-NO', { currency: { style: 'currency', currency: 'NOK' } }],
  ['ne-NP', { currency: { style: 'currency', currency: 'NPR' } }],
  ['en-NR', { currency: { style: 'currency', currency: 'AUD' } }],
  ['en-NU', { currency: { style: 'currency', currency: 'NZD' } }],
  ['en-NZ', { currency: { style: 'currency', currency: 'NZD' } }],
  ['mi-NZ', { currency: { style: 'currency', currency: 'NZD' } }],
  ['ar-OM', { currency: { style: 'currency', currency: 'OMR' } }],
  ['es-PA', { currency: { style: 'currency', currency: 'PAB' } }],
  ['es-PE', { currency: { style: 'currency', currency: 'PEN' } }],
  ['qu-PE', { currency: { style: 'currency', currency: 'PEN' } }],
  ['fr-PF', { currency: { style: 'currency', currency: 'XPF' } }],
  ['en-PG', { currency: { style: 'currency', currency: 'PGK' } }],
  ['ceb-PH', { currency: { style: 'currency', currency: 'PHP' } }],
  ['en-PH', { currency: { style: 'currency', currency: 'PHP' } }],
  ['es-PH', { currency: { style: 'currency', currency: 'PHP' } }],
  ['fil-PH', { currency: { style: 'currency', currency: 'PHP' } }],
  ['en-PK', { currency: { style: 'currency', currency: 'PKR' } }],
  ['pa-Arab-PK', { currency: { style: 'currency', currency: 'PKR' } }],
  ['ps-PK', { currency: { style: 'currency', currency: 'PKR' } }],
  ['sd-Arab-PK', { currency: { style: 'currency', currency: 'PKR' } }],
  ['ur-PK', { currency: { style: 'currency', currency: 'PKR' } }],
  ['pl-PL', { currency: { style: 'currency', currency: 'PLN' } }],
  ['fr-PM', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-PN', { currency: { style: 'currency', currency: 'NZD' } }],
  ['en-PR', { currency: { style: 'currency', currency: 'USD' } }],
  ['es-PR', { currency: { style: 'currency', currency: 'USD' } }],
  ['ar-PS', { currency: { style: 'currency', currency: 'JOD' } }],
  ['pt-PT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-PW', { currency: { style: 'currency', currency: 'USD' } }],
  ['es-PY', { currency: { style: 'currency', currency: 'PYG' } }],
  ['ar-QA', { currency: { style: 'currency', currency: 'QAR' } }],
  ['fr-RE', { currency: { style: 'currency', currency: 'EUR' } }],
  ['ro-RO', { currency: { style: 'currency', currency: 'RON' } }],
  ['sr-Cyrl-RS', { currency: { style: 'currency', currency: 'RSD' } }],
  ['sr-Latn-RS', { currency: { style: 'currency', currency: 'RSD' } }],
  ['ce-RU', { currency: { style: 'currency', currency: 'RUB' } }],
  ['cu-RU', { currency: { style: 'currency', currency: 'RUB' } }],
  ['os-RU', { currency: { style: 'currency', currency: 'RUB' } }],
  ['ru-RU', { currency: { style: 'currency', currency: 'RUB' } }],
  ['sah-RU', { currency: { style: 'currency', currency: 'RUB' } }],
  ['tt-RU', { currency: { style: 'currency', currency: 'RUB' } }],
  ['en-RW', { currency: { style: 'currency', currency: 'RWF' } }],
  ['fr-RW', { currency: { style: 'currency', currency: 'RWF' } }],
  ['rw-RW', { currency: { style: 'currency', currency: 'RWF' } }],
  ['ar-SA', { currency: { style: 'currency', currency: 'SAR' } }],
  ['en-SB', { currency: { style: 'currency', currency: 'SBD' } }],
  ['en-SC', { currency: { style: 'currency', currency: 'SCR' } }],
  ['fr-SC', { currency: { style: 'currency', currency: 'SCR' } }],
  ['ar-SD', { currency: { style: 'currency', currency: 'SDG' } }],
  ['en-SD', { currency: { style: 'currency', currency: 'SDG' } }],
  ['en-SE', { currency: { style: 'currency', currency: 'SEK' } }],
  ['se-SE', { currency: { style: 'currency', currency: 'SEK' } }],
  ['sv-SE', { currency: { style: 'currency', currency: 'SEK' } }],
  ['en-SG', { currency: { style: 'currency', currency: 'SGD' } }],
  ['ms-SG', { currency: { style: 'currency', currency: 'SGD' } }],
  ['ta-SG', { currency: { style: 'currency', currency: 'SGD' } }],
  ['zh-Hans-SG', { currency: { style: 'currency', currency: 'SGD' } }],
  ['en-SH', { currency: { style: 'currency', currency: 'GBP' } }],
  ['en-SI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['sl-SI', { currency: { style: 'currency', currency: 'EUR' } }],
  ['nb-SJ', { currency: { style: 'currency', currency: 'NOK' } }],
  ['sk-SK', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-SL', { currency: { style: 'currency', currency: 'SLL' } }],
  ['ff-Adlm-SL', { currency: { style: 'currency', currency: 'SLL' } }],
  ['ff-Latn-SL', { currency: { style: 'currency', currency: 'SLL' } }],
  ['it-SM', { currency: { style: 'currency', currency: 'EUR' } }],
  ['dyo-SN', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ff-Adlm-SN', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ff-Latn-SN', { currency: { style: 'currency', currency: 'XOF' } }],
  ['fr-SN', { currency: { style: 'currency', currency: 'XOF' } }],
  ['wo-SN', { currency: { style: 'currency', currency: 'XOF' } }],
  ['ar-SO', { currency: { style: 'currency', currency: 'SOS' } }],
  ['so-SO', { currency: { style: 'currency', currency: 'SOS' } }],
  ['nl-SR', { currency: { style: 'currency', currency: 'SRD' } }],
  ['ar-SS', { currency: { style: 'currency', currency: 'SSP' } }],
  ['en-SS', { currency: { style: 'currency', currency: 'SSP' } }],
  ['nus-SS', { currency: { style: 'currency', currency: 'SSP' } }],
  ['pt-ST', { currency: { style: 'currency', currency: 'STN' } }],
  ['es-SV', { currency: { style: 'currency', currency: 'SVC' } }],
  ['en-SX', { currency: { style: 'currency', currency: 'ANG' } }],
  ['nl-SX', { currency: { style: 'currency', currency: 'ANG' } }],
  ['ar-SY', { currency: { style: 'currency', currency: 'SYP' } }],
  ['fr-SY', { currency: { style: 'currency', currency: 'SYP' } }],
  ['en-SZ', { currency: { style: 'currency', currency: 'SZL' } }],
  ['en-TC', { currency: { style: 'currency', currency: 'USD' } }],
  ['ar-TD', { currency: { style: 'currency', currency: 'XAF' } }],
  ['fr-TD', { currency: { style: 'currency', currency: 'XAF' } }],
  ['ee-TG', { currency: { style: 'currency', currency: 'XOF' } }],
  ['fr-TG', { currency: { style: 'currency', currency: 'XOF' } }],
  ['th-TH', { currency: { style: 'currency', currency: 'THB' } }],
  ['tg-TJ', { currency: { style: 'currency', currency: 'TJS' } }],
  ['en-TK', { currency: { style: 'currency', currency: 'NZD' } }],
  ['pt-TL', { currency: { style: 'currency', currency: 'IDR' } }],
  ['tk-TM', { currency: { style: 'currency', currency: 'TMT' } }],
  ['ar-TN', { currency: { style: 'currency', currency: 'TND' } }],
  ['fr-TN', { currency: { style: 'currency', currency: 'TND' } }],
  ['en-TO', { currency: { style: 'currency', currency: 'TOP' } }],
  ['to-TO', { currency: { style: 'currency', currency: 'TOP' } }],
  ['ku-TR', { currency: { style: 'currency', currency: 'TRY' } }],
  ['tr-TR', { currency: { style: 'currency', currency: 'TRY' } }],
  ['en-TT', { currency: { style: 'currency', currency: 'TTD' } }],
  ['en-TV', { currency: { style: 'currency', currency: 'AUD' } }],
  ['zh-Hant-TW', { currency: { style: 'currency', currency: 'TWD' } }],
  ['asa-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['bez-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['en-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['jmc-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['kde-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['ksb-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['lag-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['mas-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['rof-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['rwk-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['sbp-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['sw-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['vun-TZ', { currency: { style: 'currency', currency: 'TZS' } }],
  ['ru-UA', { currency: { style: 'currency', currency: 'UAH' } }],
  ['uk-UA', { currency: { style: 'currency', currency: 'UAH' } }],
  ['cgg-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['en-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['lg-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['nyn-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['sw-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['teo-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['xog-UG', { currency: { style: 'currency', currency: 'UGX' } }],
  ['en-UM', { currency: { style: 'currency', currency: 'USD' } }],
  ['chr-US', { currency: { style: 'currency', currency: 'USD' } }],
  ['en-US', { currency: { style: 'currency', currency: 'USD' } }],
  ['en-US-POSIX', { currency: { style: 'currency', currency: 'USD' } }],
  ['es-US', { currency: { style: 'currency', currency: 'USD' } }],
  ['haw-US', { currency: { style: 'currency', currency: 'USD' } }],
  ['lkt-US', { currency: { style: 'currency', currency: 'USD' } }],
  ['es-UY', { currency: { style: 'currency', currency: 'UYU' } }],
  ['uz-Cyrl-UZ', { currency: { style: 'currency', currency: 'UZS' } }],
  ['uz-Latn-UZ', { currency: { style: 'currency', currency: 'UZS' } }],
  ['it-VA', { currency: { style: 'currency', currency: 'EUR' } }],
  ['en-VC', { currency: { style: 'currency', currency: 'XCD' } }],
  ['es-VE', { currency: { style: 'currency', currency: 'VES' } }],
  ['en-VG', { currency: { style: 'currency', currency: 'USD' } }],
  ['en-VI', { currency: { style: 'currency', currency: 'USD' } }],
  ['vi-VN', { currency: { style: 'currency', currency: 'VND' } }],
  ['en-VU', { currency: { style: 'currency', currency: 'VUV' } }],
  ['fr-VU', { currency: { style: 'currency', currency: 'VUV' } }],
  ['fr-WF', { currency: { style: 'currency', currency: 'XPF' } }],
  ['en-WS', { currency: { style: 'currency', currency: 'WST' } }],
  ['ar-YE', { currency: { style: 'currency', currency: 'YER' } }],
  ['fr-YT', { currency: { style: 'currency', currency: 'EUR' } }],
  ['af-ZA', { currency: { style: 'currency', currency: 'ZAR' } }],
  ['en-ZA', { currency: { style: 'currency', currency: 'ZAR' } }],
  ['xh-ZA', { currency: { style: 'currency', currency: 'ZAR' } }],
  ['zu-ZA', { currency: { style: 'currency', currency: 'ZAR' } }],
  ['bem-ZM', { currency: { style: 'currency', currency: 'ZMW' } }],
  ['en-ZM', { currency: { style: 'currency', currency: 'ZMW' } }],
  ['en-ZW', { currency: { style: 'currency', currency: 'ZWL' } }],
  ['nd-ZW', { currency: { style: 'currency', currency: 'ZWL' } }],
  ['sn-ZW', { currency: { style: 'currency', currency: 'ZWL' } }]
]

export const numberFormats = Object.fromEntries(numberFormatsArray)

export const findNumberFormatIETFCode = (currencyCode) => {
  const [ietfLangCode] = numberFormatsArray.find(entry => entry[1].currency.currency === currencyCode)
  return ietfLangCode
}

export default numberFormats
