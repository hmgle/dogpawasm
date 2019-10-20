package main

import (
	"syscall/js"

	"github.com/hmgle/godogpaw/engine"
)

func GetBestMove(positionFen string, depth uint8) (bestMov string) {
	eng := &engine.Engine{}
	eng.Position(positionFen)
	mov, score := eng.Search(depth)
	println(mov, score)
	return mov
}
func getMove(this js.Value, inputs []js.Value) interface{} {
	fen := inputs[0].String()
	if fen == "startpos" {
		fen = "rnbakabnr/9/1c5c1/p1p1p1p1p/9/9/P1P1P1P1P/1C5C1/9/RNBAKABNR w - - 0 1"
	}
	var depth uint8 = 4
	if len(inputs) > 1 {
		depth = uint8(inputs[1].Int())
	}

	mov := GetBestMove(fen, depth)
	return mov
}

func main() {
	js.Global().Set("getmove", js.FuncOf(getMove))
	select {}
}
