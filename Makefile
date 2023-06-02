install:
	kpackagetool5 --type=KWin/Effect -i ./kwin4_effect_geometry_change || kpackagetool5 --type=KWin/Effect -u ./kwin4_effect_geometry_change

package:
	tar -czf ./kwin4_effect_geometry_change.tar.gz ./kwin4_effect_geometry_change
