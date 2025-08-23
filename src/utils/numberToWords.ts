/**
 * Utility to convert numbers to words in Portuguese (Mozambique)
 * Specifically for Metical currency
 */

const units = [
  '', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove',
  'dez', 'onze', 'doze', 'treze', 'catorze', 'quinze', 'dezasseis', 'dezassete', 'dezoito', 'dezanove'
];

const tens = [
  '', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'
];

const hundreds = [
  '', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 
  'seiscentos', 'setecentos', 'oitocentos', 'novecentos'
];

const scales = [
  { value: 1000000000, singular: 'mil milhão', plural: 'mil milhões' },
  { value: 1000000, singular: 'milhão', plural: 'milhões' },
  { value: 1000, singular: 'mil', plural: 'mil' }
];

function convertHundreds(num: number): string {
  if (num === 0) return '';
  if (num === 100) return 'cem';
  
  let result = '';
  
  const hundredsDigit = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (hundredsDigit > 0) {
    result += hundreds[hundredsDigit];
    if (remainder > 0) {
      result += ' e ';
    }
  }
  
  if (remainder >= 20) {
    const tensDigit = Math.floor(remainder / 10);
    const unitsDigit = remainder % 10;
    result += tens[tensDigit];
    if (unitsDigit > 0) {
      result += ' e ' + units[unitsDigit];
    }
  } else if (remainder > 0) {
    result += units[remainder];
  }
  
  return result;
}

function convertThousands(num: number): string {
  if (num === 0) return '';
  
  let result = '';
  
  for (const scale of scales) {
    const scaleValue = Math.floor(num / scale.value);
    if (scaleValue > 0) {
      const scaleText = convertHundreds(scaleValue);
      if (scaleText) {
        if (scale.value === 1000) {
          // Special case for thousands
          if (scaleValue === 1) {
            result += 'mil';
          } else {
            result += scaleText + ' mil';
          }
        } else {
          // Millions and billions
          result += scaleText + ' ';
          result += scaleValue === 1 ? scale.singular : scale.plural;
        }
        
        const remainder = num % scale.value;
        if (remainder > 0) {
          result += ' ';
        }
      }
      num = num % scale.value;
    }
  }
  
  if (num > 0) {
    const hundredsText = convertHundreds(num);
    if (hundredsText) {
      result += hundredsText;
    }
  }
  
  return result.trim();
}

export function numberToWords(amount: number): string {
  if (amount === 0) {
    return 'zero meticais';
  }
  
  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);
  
  let result = '';
  
  // Convert integer part
  if (integerPart > 0) {
    const integerWords = convertThousands(integerPart);
    if (integerPart === 1) {
      result += integerWords + ' metical';
    } else {
      result += integerWords + ' meticais';
    }
  }
  
  // Convert decimal part (centavos)
  if (decimalPart > 0) {
    if (integerPart > 0) {
      result += ' e ';
    }
    const decimalWords = convertThousands(decimalPart);
    if (decimalPart === 1) {
      result += decimalWords + ' centavo';
    } else {
      result += decimalWords + ' centavos';
    }
  }
  
  return result;
}

export function formatAmountInWords(amount: number): string {
  const words = numberToWords(amount);
  // Capitalize first letter
  return words.charAt(0).toUpperCase() + words.slice(1);
}