SELECT * FROM
	( 	
		SELECT name as A_name, price as A_price, skin as A_skin, market_name as A_market_name FROM bitskins_csgo_prod.skin_sell_order WHERE skin_sell_order.skin IN
		(	
			SELECT id FROM bitskins_csgo_prod.skin WHERE skin_set = 5 AND skin_rarity = 4 AND item_state = 4 AND has_StatTrak = 1
        )
	) SQ_A
INNER JOIN
	( 	
		SELECT name as B_name, price as B_price, skin as B_skin, market_name as B_market_name FROM bitskins_csgo_prod.skin_sell_order WHERE skin_sell_order.skin IN
		(	
			SELECT id FROM bitskins_csgo_prod.skin WHERE skin_set = 5 AND skin_rarity = 5 AND item_state = 4 AND has_StatTrak = 1
        )
	) SQ_B
ON  ((A_price * 1.00) * 10.00) < (B_price * 1.00);


