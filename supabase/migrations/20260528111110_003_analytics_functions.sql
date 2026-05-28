/*
  # Analytics Functions
  
  Creates database functions for analytics data:
  - get_category_stats: Complaint counts by category
  - get_status_stats: Complaint counts by status
  - get_trend_stats: Daily complaint counts for last 30 days
*/

CREATE OR REPLACE FUNCTION get_category_stats()
RETURNS TABLE (_id text, count bigint)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT category as _id, COUNT(*) as count
  FROM complaints
  GROUP BY category
  ORDER BY count DESC;
$$;

CREATE OR REPLACE FUNCTION get_status_stats()
RETURNS TABLE (_id text, count bigint)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT status as _id, COUNT(*) as count
  FROM complaints
  GROUP BY status
  ORDER BY count DESC;
$$;

CREATE OR REPLACE FUNCTION get_trend_stats()
RETURNS TABLE (_id text, count bigint)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT DATE(created_at) as _id, COUNT(*) as count
  FROM complaints
  WHERE created_at >= NOW() - INTERVAL '30 days'
  GROUP BY DATE(created_at)
  ORDER BY _id ASC;
$$;
