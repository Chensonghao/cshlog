'use strict';
const Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const fdPath = path.join(__dirname,'../../log/');
module.exports = {
    error(msg) {
        main('error', msg);
    },
    warn(msg) {
        main('warn', msg);
    },
    info(msg) {
        main('info', msg);
    },
    debug(msg) {
        main('debug', msg);
    },
    /*
    删除日志文件，days代表保留多少天以内的文件
    */
    clear(days) {
        const limitDay = getDate(days).limitDay;
        const files = fs.readdirSync(fdPath);
        if (files && files.length > 0) {
            files.forEach(fname => {
                if (/\.log$/.test(fname)) {
                    const pre = fname.slice(0, fname.length - 4);
                    if (/^\d{8}$/.test(pre) && parseInt(pre) <= limitDay) {
                        fs.unlinkSync(`${fdPath}${fname}`);
                    }
                }
            });
        }
    }
}

function main(type, msg) {
    if (typeof msg === 'object') {
        msg = JSON.stringify(msg);
    }
    const now = getDate();
    const filepath = `${fdPath}${now.short}.log`;
    const content = JSON.stringify({
        type,
        msg,
        time: now.full
    });
    exists(fdPath).then(() => {
        createLog();
    }, () => {
        fs.mkdirSync(fdPath);
        createLog();
    });

    function createLog() {
        exists(filepath).then(() => {
            readFileAsync(filepath).then(function(oldContent) {
                writeFileAsync(filepath, oldContent + '\n' + content);
            });
        }, () => {
            writeFileAsync(filepath, content);
        });
    }
}

function getDate(days) {
    days = days || 0;
    const now = new Date();
    const ma = new Date();
    ma.setDate(ma.getDate() - days);
    let getShort = (year, m, d) => {
        return '' + year + (m < 10 ? '0' + m : m) + (d < 10 ? '0' + d : d);
    };
    return {
        limitDay: parseInt(getShort(ma.getFullYear(), ma.getMonth() + 1, ma.getDate())),
        short: getShort(now.getFullYear(), now.getMonth() + 1, now.getDate()),
        full: `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
    }
}

function exists(fpath) {
    return new Promise((resolve, reject) => {
        fs.exists(fpath, e => {
            if (e) {
                resolve(e);
            } else {
                reject(e);
            }
        });
    });
}

function readFileAsync(fpath, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(fpath, encoding, (err, content) => {
            if (err) {
                reject(err);
            } else {
                resolve(content);
            }
        });
    });
}

function writeFileAsync(fpath, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(fpath, content, err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
