var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useEffect, useRef, useState } from 'react';
import { Chessground as ChessgroundApi } from 'chessground';
function Chessground(_a) {
    var _b = _a.width, width = _b === void 0 ? 900 : _b, _c = _a.height, height = _c === void 0 ? 900 : _c, _d = _a.config, config = _d === void 0 ? {} : _d, _e = _a.contained, contained = _e === void 0 ? false : _e;
    var _f = useState(null), api = _f[0], setApi = _f[1];
    var ref = useRef(null);
    useEffect(function () {
        if (ref && ref.current && !api) {
            var chessgroundApi = ChessgroundApi(ref.current, __assign({ animation: { enabled: true, duration: 200 } }, config));
            setApi(chessgroundApi);
        }
        else if (ref && ref.current && api) {
            api.set(config);
        }
    }, [ref]);
    useEffect(function () {
        api === null || api === void 0 ? void 0 : api.set(config);
    }, [api, config]);
    return (React.createElement("div", { style: { height: contained ? '100%' : height, width: contained ? '100%' : width } },
        React.createElement("div", { ref: ref, style: { height: '100%', width: '100%', display: 'table' } })));
}
export default Chessground;
//# sourceMappingURL=index.js.map