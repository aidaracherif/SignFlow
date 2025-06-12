export interface ResponsiveItems {
	[number: number]: { items: number };
}

export interface CustomOptions {
	loop: boolean;
	mouseDrag: boolean;
	touchDrag: boolean;
	pullDrag: boolean;
	dots: boolean;
	navSpeed: number;
	autoplay: boolean;
	navText: string[];
	responsive: ResponsiveItems;
	nav: boolean;
	margin?: number;
}

export function generateCustomOptions(
  responsiveItems: ResponsiveItems,
  dots: boolean = false,
  margin?: number,
  autoplay: boolean = false
): CustomOptions {
  return {
    loop: true,
    mouseDrag: false,
    touchDrag: true,
    pullDrag: true,
    dots: dots,
    navSpeed: 700,
    autoplay: autoplay,
    navText: [
      '<i class="fa fa-arrow-left-long"></i>',
      '<i class="fa fa-arrow-right-long"></i>',
    ],
    responsive: responsiveItems,
    nav: true,
    margin: margin,
  };
}

