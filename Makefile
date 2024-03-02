.PHONY: *

install:
	kpackagetool6 --type=KWin/Effect -i ./package || kpackagetool6 --type=KWin/Effect -u ./package

uninstall:
	kpackagetool6 --type=KWin/Effect -r kwin4_effect_geometry_change

package:
	tar -czf ./kwin4_effect_geometry_change.tar.gz ./package
