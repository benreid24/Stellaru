from .extractor import Extractor

"""
Data taken from Stellaris/common/colors/00_colors.txt:

country = {
    rgb { 142 188 241 }     # Light blue
    rgb { 53 82 171 }       # Blue
    rgb { 27 42 87 }        # Dark blue
    rgb { 91 225 219 }      # Light Cyan
    rgb { 26 143 152 }      # Faded Cyan
    rgb { 0 71 75 }         # Dark Cyan
    rgb { 0 76 65 }         # Dark Teal
    rgb { 0 133 113 }       # Faded Teal
    rgb { 48 200 176 }      # Teal
    rgb { 0 225 134 }       # Light green
    rgb { 0 159 95 }        # Green
    rgb { 0 88 53 }         # Dark green
    rgb { 20 184 0 }        # Bright green
    rgb { 135 235 0 }       # Radioactive green
    rgb { 237 238 47 }      # Lemon yellow
    rgb { 255 178 26 }      # Orange
    rgb { 245 95 4 }        # Dark orange
    rgb { 235 0 18 }        # Red
    rgb { 139 0 11 }        # Dark red
    rgb { 102 67 0 }        # Brown
    rgb { 169 150 112 }     # Beige
    rgb { 213 201 178 }     # Light beige
    rgb { 223 223 223 }     # White
    rgb { 179 179 179 }     # Grey
    rgb { 124 124 124 }     # Dark grey
    rgb { 72 37 136 }       # Dark purple
    rgb { 120 95 182 }      # Purple
    rgb { 201 186 242 }     # Violet
    rgb { 208 130 197 }     # Pink
    rgb { 255 201 208 }     # Light pink
    rgb { 241 64 87 }       # Hot pink
    rgb { 191 114 124 }     # Old pink
}
"""

COLORS = {
    'light_blue': 'rgb(142, 188, 241)',
    'blue': 'rgb(53, 82, 171)',
    'dark_blue': 'rgb(27, 42, 87)',
    'light_cyan': 'rgb(91, 225, 219)',
    'faded_cyan': 'rgb(26, 143, 152)',
    'dark_cyan': 'rgb(0, 71, 75)',
    'dark_teal': 'rgb(0, 76, 65)',
    'faded_teal': 'rgb(0, 133, 113)',
    'teal': 'rgb(48, 200, 176)',
    'light_green': 'rgb(0, 225, 134)',
    'green': 'rgb(0, 159, 95)',
    'dark_green': 'rgb(0, 88, 53)',
    'bright_green': 'rgb(20, 184, 0)',
    'radioactive_green': 'rgb(135, 235, 0)',
    'lemon_yellow': 'rgb(237, 238, 47)',
    'orange': 'rgb(255, 178, 26)',
    'dark_orange': 'rgb(245, 95, 4)',
    'red': 'rgb(235, 0, 18)',
    'dark_red': 'rgb(139, 0, 11)',
    'brown': 'rgb(102, 67, 0)',
    'beige': 'rgb(169, 150, 112)',
    'light_beige': 'rgb(213, 201, 178)',
    'white': 'rgb(223, 223, 223)',
    'grey': 'rgb(179, 179, 179)',
    'dark_grey': 'rgb(124, 124, 124)',
    'dark_purple': 'rgb(72, 37, 136)',
    'purple': 'rgb(120, 95, 182)',
    'violet': 'rgb(201, 186, 242)',
    'pink': 'rgb(208, 130, 197)',
    'light_pink': 'rgb(255, 201, 208)',
    'hot_pink': 'rgb(241, 64, 87)',
    'old_pink': 'rgb(191, 114, 124)',
}


class ColorExtractor(Extractor):
    def __init__(self, isolation_layer):
        super().__init__(isolation_layer)

    def data_key(self):
        return 'colors'

    def extract_data(self, state, empire):
        colors = self.isolation_layer.get_colors(state, empire)
        return [
            COLORS[colors[0]] if colors[0] in COLORS else COLORS['orange'],
			COLORS[colors[1]] if colors[1] in COLORS else COLORS['bright_green']
        ]
