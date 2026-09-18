CREATE TABLE IF NOT EXISTS meetings (
  id             SERIAL        PRIMARY KEY,
  date           DATE          NOT NULL UNIQUE,
  meeting_type   VARCHAR(20)   NOT NULL CHECK (meeting_type IN ('testimony', 'regular', 'stake', 'general', 'special')),
  presiding      VARCHAR(255)  NOT NULL,
  conducting     VARCHAR(255)  NOT NULL,
  announcements  TEXT[]        DEFAULT '{}',
  opening_hymn   JSONB         NOT NULL,
  opening_prayer VARCHAR(255)  NOT NULL,
  ward_business  JSONB         DEFAULT '[]',
  stake_business BOOLEAN       DEFAULT false,
  sacrament_hymn JSONB         NOT NULL,
  speakers       JSONB         DEFAULT '[]',
  closing_hymn   JSONB         NOT NULL,
  closing_prayer VARCHAR(255)  NOT NULL
);

INSERT INTO meetings (date, meeting_type, presiding, conducting, announcements, opening_hymn, opening_prayer, ward_business, stake_business, sacrament_hymn, speakers, closing_hymn, closing_prayer)
VALUES
  ('2026-08-30', 'testimony', 'Bishop Paixão', 'Brother Lewis', ARRAY['Ward picnic next Saturday at 5:30 p.m.', 'Choir practice today at 3:00 p.m.'], '{"number":2,"title":"The Spirit of God"}', 'Sister Flores', '[{"description":"Welcome new members of the ward."}]', false, '{"number":169,"title":"As Now We Take the Sacrament"}', '[]', '{"number":85,"title":"How Firm a Foundation"}', 'Brother Kim'),
  ('2026-09-06', 'regular', 'Bishop Paixão', 'Counselor Davis', ARRAY['Temple recommend interviews are available Thursday evening.'], '{"number":6,"title":"Redeemer of Israel"}', 'Brother Patel', '[{"description":"Sustain Aaron Miller as a teacher in the elders quorum."}]', false, '{"number":170,"title":"God, Our Father, Hear Us Pray"}', '[{"name":"Sister Naomi Young","topic":"Finding peace through the Savior","type":"speaker"},{"name":"Brother Mateo Cruz","topic":"Ministering with love","type":"speaker"}]', '{"number":89,"title":"The Lord Is My Light"}', 'Sister Hall'),
  ('2026-09-13', 'regular', 'Bishop Paixão', 'Counselor Davis', ARRAY['Youth standards night will be held Wednesday at 7:00 p.m.'], '{"number":19,"title":"We Thank Thee, O God, for a Prophet"}', 'Sister Harper', '[{"description":"Release and sustain Primary teachers."}]', false, '{"number":175,"title":"O God, the Eternal Father"}', '[{"name":"Brother Eli Thompson","topic":"Covenants that lead us to Christ","type":"speaker"},{"name":"Sister Maren Smith","topic":"Growing faith through daily scripture study","type":"speaker"}]', '{"number":100,"title":"Nearer, My God, to Thee"}', 'Brother Walker'),
  ('2026-09-20', 'stake', 'Stake President Anderson', 'Stake Presidency', ARRAY['This meeting will be held at the stake center.'], '{"number":65,"title":"Come, All Ye Saints of Zion"}', 'Sister Lee', '[]', true, '{"number":0,"title":"Not applicable"}', '[{"name":"Stake Presidency","topic":"Stake conference instruction","type":"speaker"}]', '{"number":26,"title":"Joseph Smith''s First Prayer"}', 'Brother Martin'),
  ('2026-09-27', 'general', 'Bishop Paixão', 'Counselor Davis', ARRAY['General conference broadcast begins at 10:00 a.m. in the chapel.'], '{"number":0,"title":"Not applicable"}', 'Not applicable', '[]', false, '{"number":0,"title":"Not applicable"}', '[]', '{"number":0,"title":"Not applicable"}', 'Not applicable'),
  ('2026-10-04', 'testimony', 'Bishop Paixão', 'Brother Lewis', ARRAY['Fast offering envelopes are available in the foyer.'], '{"number":27,"title":"Praise to the Man"}', 'Brother Chen', '[]', false, '{"number":196,"title":"Jesus, Once of Humble Birth"}', '[]', '{"number":124,"title":"Be Still, My Soul"}', 'Sister Rodriguez'),
  ('2026-10-11', 'regular', 'Bishop Paixão', 'Counselor Davis', ARRAY['Ward service project begins Saturday at 9:00 a.m.'], '{"number":5,"title":"High on the Mountain Top"}', 'Sister Nguyen', '[]', false, '{"number":174,"title":"While of These Emblems We Partake"}', '[{"name":"Brother Daniel Brooks","topic":"Serving one another","type":"speaker"},{"name":"Sister Amara Reed","topic":"Hope in Jesus Christ","type":"speaker"}]', '{"number":270,"title":"I''ll Go Where You Want Me to Go"}', 'Brother Allen'),
  ('2026-10-18', 'special', 'Bishop Paixão', 'Counselor Davis', ARRAY['Primary program rehearsal follows the meeting.'], '{"number":72,"title":"The Morning Breaks"}', 'Sister Bell', '[]', false, '{"number":189,"title":"O Thou, Before the World Began"}', '[{"name":"Ward Choir","topic":"I Need Thee Every Hour","type":"musical-number"},{"name":"Sister Priya Shah","topic":"Building a Christ-centered home","type":"speaker"}]', '{"number":241,"title":"Count Your Blessings"}', 'Brother Moore'),
  ('2026-10-25', 'regular', 'Bishop Paixão', 'Counselor Davis', ARRAY['Missionary preparation class meets Thursday evening.'], '{"number":66,"title":"Rejoice, the Lord Is King!"}', 'Sister Ortiz', '[]', false, '{"number":185,"title":"Reverently and Meekly Now"}', '[{"name":"Brother James Porter","topic":"The power of prayer","type":"speaker"}]', '{"number":130,"title":"Where Can I Turn for Peace?"}', 'Sister Green')
ON CONFLICT (date) DO NOTHING;
