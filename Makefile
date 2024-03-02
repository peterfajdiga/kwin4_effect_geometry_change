.PHONY: *

VERSION = $(shell grep '"Version":' ./package/metadata.json | grep -o '[0-9\.]*')

install:
	kpackagetool6 --type=KWin/Effect -i ./package || kpackagetool6 --type=KWin/Effect -u ./package

uninstall:
	kpackagetool6 --type=KWin/Effect -r kwin4_effect_geometry_change

package:
	tar -czf ./kwin4_effect_geometry_change_${subst .,_,${VERSION}}.tar.gz ./package
