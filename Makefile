.PHONY: *

install:
	kpackagetool5 --type=KWin/Effect -i ./package || kpackagetool5 --type=KWin/Effect -u ./package

uninstall:
	kpackagetool5 --type=KWin/Effect -r ./package

package:
	tar -czf ./kwin4_effect_geometry_change.tar.gz ./package
