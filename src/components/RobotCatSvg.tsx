import React from 'react';

export function RobotCatSvg({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 512 512" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
          <radialGradient id="bg-grad" cx="50%" cy="50%" r="70%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
          </radialGradient>

          <linearGradient id="blue-metal" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="40%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
          </linearGradient>
          
          <linearGradient id="blue-metal-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" />
              <stop offset="50%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          <linearGradient id="dark-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="50%" stopColor="#172554" />
              <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="silver-metal" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="40%" stopColor="#cbd5e1" />
              <stop offset="80%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <radialGradient id="arc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="20%" stopColor="#a5f3fc" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#083344" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="eye-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#083344" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="cat-fur" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f1f5f9" />
              <stop offset="90%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
          
          <linearGradient id="cat-shadow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="100%" stopColor="#64748b" stopOpacity="0.4" />
          </linearGradient>
      </defs>

      <rect width="512" height="512" fill="url(#bg-grad)"/>
      
      <g opacity="0.15">
          <circle cx="256" cy="256" r="220" fill="none" stroke="#38bdf8" strokeWidth="1"/>
          <circle cx="256" cy="256" r="180" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 15"/>
          <circle cx="256" cy="256" r="140" fill="none" stroke="#38bdf8" strokeWidth="1"/>
          <path d="M256 16 L256 56 M256 456 L256 496 M16 256 L56 256 M456 256 L496 256" stroke="#38bdf8" strokeWidth="2"/>
          <path d="M86 86 L116 116 M426 426 L396 396 M86 426 L116 396 M426 86 L396 116" stroke="#38bdf8" strokeWidth="2"/>
      </g>

      <g transform="translate(0, -15)">
          <g id="robot-right-arm">
              <circle cx="140" cy="230" r="35" fill="url(#dark-metal)"/>
              <path d="M100 200 C120 170, 170 180, 180 230 C180 260, 130 270, 95 240 Z" fill="url(#blue-metal)"/>
              <path d="M110 205 C125 185, 160 195, 165 230 C165 250, 130 255, 105 235 Z" fill="url(#silver-metal)"/>
              <path d="M120 240 L100 340 L160 350 L170 250 Z" fill="url(#dark-metal)"/>
              <path d="M125 250 L110 335 L135 340 L150 255 Z" fill="url(#blue-metal)"/>
              <circle cx="130" cy="345" r="20" fill="url(#silver-metal)"/>
              <circle cx="130" cy="345" r="10" fill="url(#dark-metal)"/>
              <path d="M115 340 L160 430 L210 410 L150 330 Z" fill="url(#blue-metal)"/>
              <path d="M130 350 L165 415 L195 400 L150 345 Z" fill="url(#silver-metal)"/>
          </g>

          <g id="robot-torso">
              <path d="M210 150 L302 150 L285 200 L227 200 Z" fill="url(#dark-metal)"/>
              <path d="M220 150 L292 150 L275 190 L237 190 Z" fill="url(#silver-metal)"/>
              <path d="M246 150 L266 150 L266 190 L246 190 Z" fill="url(#dark-metal)"/>
              
              <path d="M160 210 Q256 240 352 210 L370 240 Q256 275 142 240 Z" fill="url(#dark-metal)"/>
              <path d="M170 215 Q256 240 342 215 L355 235 Q256 265 157 235 Z" fill="url(#blue-metal)"/>
              
              <path d="M142 240 L256 275 L370 240 L340 370 L256 410 L172 370 Z" fill="url(#blue-metal)"/>
              
              <path d="M175 250 L256 280 L337 250 L310 350 L256 385 L202 350 Z" fill="url(#dark-metal)"/>
              <path d="M195 260 L256 285 L317 260 L295 330 L256 355 L217 330 Z" fill="url(#silver-metal)"/>
              <path d="M210 270 L256 290 L302 270 L285 315 L256 335 L227 315 Z" fill="url(#blue-metal-light)"/>
              
              <path d="M217 330 L256 355 L295 330 L285 390 L256 420 L227 390 Z" fill="url(#dark-metal)"/>
              <path d="M227 345 L256 365 L285 345 L275 380 L256 400 L237 380 Z" fill="url(#silver-metal)"/>

              <path d="M175 250 L256 280 L337 250" stroke="#7dd3fc" strokeWidth="2" fill="none" opacity="0.6"/>
              <path d="M195 260 L256 285 L317 260" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.8"/>
              <path d="M256 290 L256 335" stroke="#0284c7" strokeWidth="2" fill="none"/>
              
              <circle cx="256" cy="285" r="38" fill="url(#dark-metal)"/>
              <circle cx="256" cy="285" r="30" fill="url(#silver-metal)"/>
              <circle cx="256" cy="285" r="24" fill="url(#arc-glow)"/>
              <circle cx="256" cy="285" r="14" fill="#ffffff"/>
              
              <path d="M256 267 L272 295 L240 295 Z" fill="none" stroke="#082f49" strokeWidth="2" opacity="0.5"/>
              <circle cx="256" cy="285" r="6" fill="#cffafe"/>
              
              <circle cx="256" cy="285" r="70" fill="url(#arc-glow)" opacity="0.6"/>
              
              <circle cx="190" cy="235" r="6" fill="#a5f3fc"/>
              <circle cx="190" cy="235" r="3" fill="#ffffff"/>
              <circle cx="322" cy="235" r="6" fill="#a5f3fc"/>
              <circle cx="322" cy="235" r="3" fill="#ffffff"/>
          </g>

          <g id="robot-head">
              <path d="M256 40 C170 40, 160 120, 170 170 L200 200 L312 200 L342 170 C352 120, 342 40, 256 40 Z" fill="url(#blue-metal)"/>
              
              <path d="M236 45 L256 65 L276 45 Z" fill="url(#silver-metal)"/>
              <path d="M256 65 L256 95" stroke="#7dd3fc" strokeWidth="2" fill="none"/>

              <path d="M170 170 L200 200 L230 170 L180 130 Z" fill="url(#dark-metal)"/>
              <path d="M342 170 L312 200 L282 170 L332 130 Z" fill="url(#dark-metal)"/>
              
              <path d="M190 110 C210 90, 302 90, 322 110 L330 150 L285 210 L256 225 L227 210 L182 150 Z" fill="url(#silver-metal)"/>
              
              <path d="M210 115 L256 140 L302 115 L256 95 Z" fill="url(#blue-metal-light)"/>
              <path d="M225 120 L256 135 L287 120 L256 105 Z" fill="url(#blue-metal)"/>
              
              <path d="M195 150 L235 170 L256 205 L227 210 Z" fill="url(#dark-metal)" opacity="0.3"/>
              <path d="M317 150 L277 170 L256 205 L285 210 Z" fill="url(#dark-metal)" opacity="0.3"/>
              
              <path d="M237 210 L256 225 L275 210 L256 190 Z" fill="url(#dark-metal)"/>
              <path d="M245 205 L256 215 L267 205 L256 195 Z" fill="url(#blue-metal-light)"/>

              <polygon points="195,145 245,158 245,148 210,135" fill="#020617"/>
              <polygon points="317,145 267,158 267,148 302,135" fill="#020617"/>

              <polygon points="200,147 242,156 242,150 212,138" fill="#cffafe"/>
              <polygon points="205,148 238,154 238,151 215,141" fill="#ffffff"/>
              
              <polygon points="312,147 270,156 270,150 300,138" fill="#cffafe"/>
              <polygon points="307,148 274,154 274,151 297,141" fill="#ffffff"/>

              <circle cx="220" cy="148" r="20" fill="url(#eye-glow)" opacity="0.8"/>
              <circle cx="292" cy="148" r="20" fill="url(#eye-glow)" opacity="0.8"/>
          </g>

          <path d="M130 390 C120 340, 240 330, 290 360 C330 380, 320 440, 270 450 C210 460, 140 440, 130 390 Z" fill="#020617" opacity="0.4"/>

          <g id="white-cat">
              <path d="M270 390 Q350 380 340 450 Q330 490 250 450 Q270 440 300 450 Q320 450 310 410 Q300 390 270 410 Z" fill="url(#cat-fur)"/>
              
              <path d="M140 380 C120 320, 240 310, 290 340 C330 360, 320 420, 270 430 C210 440, 150 420, 140 380 Z" fill="url(#cat-fur)"/>
              
              <path d="M150 380 L135 390 L155 395 L145 405 L170 400 Z" fill="url(#cat-fur)"/>
              <path d="M260 425 L275 435 L265 440 L285 445 L270 450 Z" fill="url(#cat-fur)"/>
              
              <path d="M140 380 C150 410, 210 430, 270 430 C300 430, 320 410, 320 400 C310 420, 270 435, 210 435 C150 435, 135 400, 140 380 Z" fill="url(#cat-shadow)"/>

              <path d="M170 415 C160 415, 150 430, 160 440 C170 450, 190 440, 185 425 Z" fill="url(#cat-fur)"/>
              <path d="M200 420 C190 420, 180 435, 190 445 C200 455, 220 445, 215 430 Z" fill="url(#cat-fur)"/>
              <path d="M165 435 L168 425 M175 438 L175 428 M182 435 L180 425" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M195 440 L198 430 M205 443 L205 433 M212 440 L210 430" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>

              <circle cx="170" cy="335" r="42" fill="url(#cat-fur)"/>
              
              <path d="M130 330 L115 335 L135 345 L120 355 L145 360 Z" fill="url(#cat-fur)"/>
              <path d="M210 330 L225 335 L205 345 L220 355 L195 360 Z" fill="url(#cat-fur)"/>

              <path d="M140 305 L125 255 L165 295 Z" fill="url(#cat-fur)"/>
              <path d="M142 300 L132 265 L158 295 Z" fill="#fbcfe8"/>
              <path d="M200 305 L215 255 L175 295 Z" fill="url(#cat-fur)"/>
              <path d="M198 300 L208 265 L182 295 Z" fill="#fbcfe8"/>

              <path d="M140 300 C160 280, 200 280, 220 300 C200 290, 160 290, 140 300 Z" fill="#a5f3fc" opacity="0.7"/>
              <path d="M150 310 Q200 280 250 310 Q270 330 250 340 Q200 310 150 330 Z" fill="url(#arc-glow)" opacity="0.3"/>

              <ellipse cx="145" cy="345" rx="8" ry="5" fill="#fbcfe8" opacity="0.7"/>
              <ellipse cx="195" cy="345" rx="8" ry="5" fill="#fbcfe8" opacity="0.7"/>
              
              <path d="M140 335 Q150 320 160 335" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round"/>
              <path d="M180 335 Q190 320 200 335" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round"/>
              
              <path d="M165 345 L175 345 L170 350 Z" fill="#f472b6"/>
              
              <path d="M170 350 Q165 357 160 353 M170 350 Q175 357 180 353" stroke="#334155" strokeWidth="2" fill="none" strokeLinecap="round"/>
              
              <path d="M135 340 L105 335 M135 347 L100 347 M135 354 L105 359" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
              <path d="M205 340 L235 335 M205 347 L240 347 M205 354 L235 359" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
          </g>

          <g id="robot-left-arm">
              <circle cx="370" cy="230" r="35" fill="url(#dark-metal)"/>
              
              <path d="M330 190 C360 160, 430 180, 440 230 C440 250, 400 260, 350 220 Z" fill="url(#blue-metal)"/>
              <path d="M345 200 C370 180, 415 195, 425 230 C425 240, 395 245, 360 215 Z" fill="url(#silver-metal)"/>
              <path d="M355 205 C375 190, 405 205, 410 225 C410 230, 390 235, 365 215 Z" fill="url(#blue-metal-light)"/>
              
              <path d="M350 230 L410 260 L380 350 L330 330 Z" fill="url(#dark-metal)"/>
              <path d="M360 240 L400 265 L375 340 L340 320 Z" fill="url(#blue-metal)"/>
              
              <circle cx="355" cy="340" r="22" fill="url(#silver-metal)"/>
              <circle cx="355" cy="340" r="12" fill="url(#dark-metal)"/>
              <circle cx="355" cy="340" r="6" fill="#7dd3fc"/>
              
              <path d="M330 330 L380 350 L310 440 L260 410 Z" fill="url(#blue-metal)"/>
              <path d="M335 345 L370 360 L315 425 L280 405 Z" fill="url(#silver-metal)"/>
              <path d="M340 355 L360 365 L315 415 L295 400 Z" fill="url(#blue-metal-light)"/>
              
              <path d="M260 410 L310 440 L270 475 L220 440 Z" fill="url(#dark-metal)"/>
              <path d="M265 415 L300 440 L270 465 L235 440 Z" fill="url(#silver-metal)"/>
              
              <path d="M220 435 C200 425, 185 405, 195 395 C205 385, 225 395, 235 410 Z" fill="url(#blue-metal)"/>
              <path d="M222 430 C207 422, 195 407, 202 400 C209 393, 222 400, 230 410 Z" fill="url(#silver-metal)"/>
              
              <path d="M235 445 C215 435, 200 415, 210 405 C220 395, 240 405, 250 420 Z" fill="url(#blue-metal)"/>
              <path d="M237 440 C222 432, 210 417, 217 410 C224 403, 237 410, 245 420 Z" fill="url(#silver-metal)"/>
              
              <path d="M250 455 C230 445, 215 425, 225 415 C235 405, 255 415, 265 430 Z" fill="url(#blue-metal)"/>
              <path d="M252 450 C237 442, 225 427, 232 420 C239 413, 252 420, 260 430 Z" fill="url(#silver-metal)"/>
              
              <polygon points="260,425 280,435 270,450 250,440" fill="url(#dark-metal)"/>
              <circle cx="265" cy="437" r="8" fill="#0284c7"/>
              <circle cx="265" cy="437" r="5" fill="#a5f3fc"/>
              <circle cx="265" cy="437" r="2" fill="#ffffff"/>
              <circle cx="265" cy="437" r="15" fill="url(#arc-glow)" opacity="0.6"/>
          </g>

          <g fill="#cffafe" opacity="0.6">
              <circle cx="200" cy="260" r="2"/>
              <circle cx="310" cy="270" r="1.5"/>
              <circle cx="230" cy="310" r="2.5"/>
              <circle cx="280" cy="320" r="1"/>
              <circle cx="260" cy="240" r="1.5"/>
              <circle cx="180" cy="290" r="1"/>
              <circle cx="330" cy="300" r="2"/>
          </g>
      </g>
    </svg>
  );
}
