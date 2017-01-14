var Base58Encoder = function(){
    var self = this;
    var alphabet = '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
    var base = alphabet.length;

    self.encode = function(num){
        var encoded = '';
        while(num){
            var remainder = num % base;
            num = Math.floor(num/base);
            encoded = alphabet[remainder].toString() + encoded;
        }
        return encoded;
    };

    self.decode = function(encoded){
        var decoded = 0;
        while(encoded){
            var index = alphabet.indexOf(str[0]);
            var power = encoded.length + 1;
            decoded += index * (Math.pow(base,power));
            encoded = encoded.substring(1);
        }
        return decoded;
    };

    return self;
};

module.exports = Base58Encoder;