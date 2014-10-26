/*
 * Parser.js
 * Ce fichier sert à traiter les données reçues
 */
 
exports.Parser = {
    room: '', // La room où se passe l'action, acualisée en permanence
    parser: function(c, data) {
        if (!data) return;
        if (data.indexOf('\n') > -1) {
            var spl = data.split('\n');
            for (var i = 0; i < spl.length; i++) {
                if (spl[i].split('|')[1] && (spl[i].split('|')[1] === 'init' || spl[i].split('|')[1] === 'tournament')) {
                    this.room = '';
                    break;
                }
                this.parser(c, spl[i]);
            }
            return;
        }
        var t = data.split('|');
        if (!t[1]) {
            t = data.split('>');
            if (!t[1])
                return;
            this.room = t[1];
        }

        switch (t[1]) {
            //Ce qui se passe sur la room
            case 'c:':
                console.log('(Room ' + this.room + ') ' + t[3] + ': ' + t[4]);
                this.iscommand(c, t[4], t[3], this.room);
                break;
                //Ce qui se passe en PM
            case 'pm':
                console.log('(Room PM) ' + t[2] + ': ' + t[4]);
                this.iscommand(c, t[4], t[2], '#' + t[2]);
                break;
            case 'J':
                //Servira pour les !ab
                break;
        }
    },
    //Message ou commande ?
    iscommand: function(c, msg, from, room) {
        console.log(msg.substr(0, comchar.length));
        if (msg.substr(0, comchar.length) === comchar) {
            //C'est une commande, on vérifie si elle existe
            msg = msg.substr(comchar.length);
            var index = msg.indexOf(' ');
            var params = null;
            if (index > -1) {
                var command = msg.substr(0, index);
                params = msg.substr(index + 1).trim();
            } else {
                var command = msg;
            }
            //La condition retourne 0 si la commande n'existe pas
            if (Cmd[command]) Cmd[command].call(this, c, params, from, room);
        }
    },
    talk: function(c, room, msg) {
        // Le format de la 'room' du PM est comme ceci:
        // room = #utilisateur
        if (room.charAt(0) == '#') {
            var to = room.substr(1);
            var txt = '|/pm ' + to + ', ' + msg;
            send_datas(c, txt);
        } else {
            var txt = room + '|' + msg;
            send_datas(c, txt);
        }
    }
};
