module.exports = io => {
    var line_history = [];
    io.on('connection', socket => {
          socket.on('draw_line', data => {
            line_history.push(data.line);
            io.emit('draw_line', { line: data.line });
          });
    })
}