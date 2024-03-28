{-# LANGUAGE FlexibleContexts  #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE TemplateHaskell   #-}

module VVA.Network where

import           Control.Monad.Except       (MonadError, throwError)
import           Control.Monad.Reader

import           Data.Aeson                 (Value)
import           Data.ByteString            (ByteString)
import           Data.FileEmbed             (embedFile)
import           Data.Has                   (Has)
import           Data.String                (fromString)
import           Data.Text                  (Text, unpack)
import qualified Data.Text.Encoding         as Text
import           Data.Time.Clock

import qualified Database.PostgreSQL.Simple as SQL

import           VVA.Config
import           VVA.Pool                   (ConnectionPool, withPool)
import           VVA.Types

sqlFrom :: ByteString -> SQL.Query
sqlFrom bs = fromString $ unpack $ Text.decodeUtf8 bs

networkMetricsSql :: SQL.Query
networkMetricsSql = sqlFrom $(embedFile "sql/get-network-metrics.sql")

networkMetrics ::
  (Has ConnectionPool r, Has VVAConfig r, MonadReader r m, MonadIO m, MonadError AppError m) =>
  m NetworkMetrics
networkMetrics = withPool $ \conn -> do
  result <- liftIO $ SQL.query_ conn networkMetricsSql
  current_time <- liftIO getCurrentTime
  case result of
    [( epoch_no
     , block_no
     , unique_delegators
     , total_delegations
     , total_gov_action_proposals
     , total_drep_votes
     , total_registered_dreps
     , always_abstain_voting_power
     , always_no_confidence_voting_power
     )] -> return $ NetworkMetrics
            current_time
            epoch_no
            block_no
            unique_delegators
            total_delegations
            total_gov_action_proposals
            total_drep_votes
            total_registered_dreps
            always_abstain_voting_power
            always_no_confidence_voting_power
    _ -> throwError $ CriticalError "Could not query the network metrics. This should never happen."
